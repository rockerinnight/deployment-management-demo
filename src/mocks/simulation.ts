import {
  APPLICATION,
  type Action,
  type Job,
  type RequestFields,
} from '../features/deployment/model'
import { can, type Role } from '../shared/policy'

export class DemoError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export function createSimulation(stepMs = 850) {
  const records = new Map<string, Job>()
  const timers = new Set<ReturnType<typeof setTimeout>>()
  const listeners = new Set<(job: Job) => void>()
  let order = 0

  function make(
    fields: Pick<Job, 'application' | 'environment' | 'version'>,
  ): Job {
    const number = ++order
    return {
      ...fields,
      id: `DEP-${String(number).padStart(3, '0')}`,
      order: number,
      createdAt: new Date().toISOString(),
      revision: 0,
      progress: 0,
      phase: 'pending',
      outcome: null,
      confirmed: false,
      logs: ['Request submitted for approval.'],
    }
  }

  function reset() {
    for (const timer of timers) clearTimeout(timer)
    timers.clear()
    listeners.clear()
    records.clear()
    order = 0
    for (let i = 9; i >= 0; i--) {
      const job = make({
        application: APPLICATION,
        environment: 'Staging',
        version: i === 0 ? '1.8.0' : `1.7.${9 - i}`,
      })
      records.set(job.id, {
        ...job,
        createdAt: new Date(Date.UTC(2025, 6, 12 - i, 9)).toISOString(),
        phase: 'done',
        outcome: 'success',
        progress: 100,
        confirmed: true,
        logs: ['Health check passed.'],
      })
    }
  }

  function list() {
    return [...records.values()].reverse()
  }

  function get(id: string) {
    const job = records.get(id)
    if (!job) throw new DemoError(404, 'Deployment not found.')
    return job
  }

  function related(job: Job) {
    return list().filter(
      (candidate) =>
        candidate.application === job.application &&
        candidate.environment === job.environment,
    )
  }

  function update(job: Job, change: Partial<Job>) {
    const revised = { ...job, ...change, revision: job.revision + 1 }
    records.set(revised.id, revised)
    for (const send of listeners) send(revised)
    return revised
  }

  function start(job: Job, rollback: boolean) {
    update(job, { phase: 'in-progress', logs: ['Execution started.'] })
    const steps = [
      [25, 'Build artifact loaded.'],
      [55, `Build ${job.version} activated.`],
      [80, 'Running the simulated health check.'],
      [
        100,
        rollback
          ? `Health check passed. Build ${job.version} restored.`
          : 'Health check failed. The new build is unhealthy.',
      ],
    ] as const
    steps.forEach(([progress, message], index) => {
      const timer = setTimeout(
        () => {
          timers.delete(timer)
          const current = get(job.id)
          update(current, {
            progress,
            logs: [...current.logs, message],
            ...(progress === 100
              ? { phase: 'done', outcome: rollback ? 'success' : 'failure' }
              : {}),
          })
        },
        stepMs * (index + 1),
      )
      timers.add(timer)
    })
  }

  function create(role: Role, fields: RequestFields) {
    if (
      !can(role, fields.environment === 'Staging' ? 'staging' : 'production')
    ) {
      throw new DemoError(
        403,
        'This role cannot request Production deployments.',
      )
    }
    const { application, environment, version } = fields
    if (
      list().some(
        (job) =>
          job.environment === environment &&
          job.version === version &&
          job.phase !== 'done',
      )
    ) {
      throw new DemoError(409, 'A request for this build is already active.')
    }
    const job = make({ application, environment, version })
    records.set(job.id, job)
    return job
  }

  function act(role: Role, action: Action, id: string) {
    if (!can(role, action))
      throw new DemoError(403, `This role cannot ${action} deployments.`)
    const job = get(id)
    const history = related(job)
    if (history.some((record) => record.phase === 'in-progress')) {
      throw new DemoError(
        409,
        'A deployment is already running in this environment.',
      )
    }
    if (action === 'approve') {
      if (job.phase !== 'pending')
        throw new DemoError(409, 'Only pending requests can be approved.')
      const previousVersion = history
        .filter((record) => record.outcome === 'success')
        .at(0)?.version
      start({ ...job, previousVersion }, false)
      return
    }
    if (
      job.outcome !== 'failure' ||
      !job.previousVersion ||
      job.rollbackId ||
      history.find((record) => record.phase !== 'pending')?.id !== id
    ) {
      throw new DemoError(409, 'This deployment is not eligible for rollback.')
    }
    const recovery = {
      ...make({
        application: job.application,
        environment: job.environment,
        version: job.previousVersion,
      }),
      rollbackOf: id,
    }
    update(job, { rollbackId: recovery.id })
    start(recovery, true)
  }

  function subscribe(ids: Set<string>, send: (job: Job) => void) {
    const listener = (job: Job) => {
      if (ids.has(job.id) || (job.rollbackOf && ids.has(job.rollbackOf)))
        send(job)
    }
    listeners.add(listener)
    list().forEach(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  reset()
  return { list, get, create, act, reset, subscribe }
}
