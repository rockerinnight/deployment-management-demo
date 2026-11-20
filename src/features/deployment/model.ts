import { z } from 'zod'

export const ENVIRONMENTS = ['Staging', 'Production'] as const
export const APPLICATION = 'Orders API'
export const requestSchema = z.object({
  application: z.literal(APPLICATION, { error: 'Select an application.' }),
  environment: z.enum(ENVIRONMENTS, { error: 'Select an environment.' }),
  version: z
    .string()
    .trim()
    .regex(/^\d+\.\d+\.\d+$/, 'Enter a version such as 1.9.0.'),
  scenario: z.literal('fail', {
    error: 'Select the simulated failure scenario.',
  }),
})

export type RequestFields = z.infer<typeof requestSchema>
export type Environment = RequestFields['environment']
export type Action = 'approve' | 'rollback'
export type Job = Omit<RequestFields, 'scenario'> & {
  id: string
  order: number
  revision: number
  createdAt: string
  phase: 'pending' | 'in-progress' | 'done'
  outcome: 'success' | 'failure' | null
  confirmed: boolean
  progress: number
  logs: string[]
  previousVersion?: string
  rollbackOf?: string
  rollbackId?: string
}

export const STATUS_LABELS = {
  pending: 'Approval Pending',
  'in-progress': 'In Progress',
  success: 'Success',
  failure: 'Failed',
} as const

export function statusOf(job: Job) {
  return job.outcome ?? (job.phase === 'done' ? 'in-progress' : job.phase)
}

export function mergeJobs(snapshot: Job[], events: readonly Job[]) {
  const jobs = new Map(snapshot.map((job) => [job.id, job]))
  for (const event of events) {
    if ((jobs.get(event.id)?.revision ?? -1) < event.revision)
      jobs.set(event.id, event)
  }
  return [...jobs.values()].sort((a, b) => b.order - a.order)
}

export function jobPage(
  jobs: Job[],
  environment: string,
  status: string,
  page: number,
  pageSize: number,
) {
  const matching = jobs.filter(
    (job) =>
      (!environment || job.environment === environment) &&
      (!status || statusOf(job) === status),
  )
  const last = Math.max(1, Math.ceil(matching.length / pageSize))
  const current = Number.isSafeInteger(page)
    ? Math.min(last, Math.max(1, page))
    : 1
  return {
    rows: matching.slice((current - 1) * pageSize, current * pageSize),
    total: matching.length,
    page: current,
  }
}
