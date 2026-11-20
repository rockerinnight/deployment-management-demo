import { afterEach, expect, test, vi } from 'vitest'
import {
  APPLICATION,
  jobPage,
  mergeJobs,
  type Job,
} from '../features/deployment/model'
import { createSimulation, DemoError } from './simulation'

afterEach(() => vi.useRealTimers())

const REQUEST = {
  application: APPLICATION,
  environment: 'Staging',
  version: '1.9.0',
  scenario: 'fail',
} as const

test('permissions and conflicts do not advance execution; rollback preserves the failure', () => {
  vi.useFakeTimers()
  const api = createSimulation()
  expect(() =>
    api.create('Developer', { ...REQUEST, environment: 'Production' }),
  ).toThrow(DemoError)
  const job = api.create('Developer', REQUEST)
  expect(job.phase).toBe('pending')
  expect(() => api.create('Developer', REQUEST)).toThrow('already active')
  expect(() => api.act('Developer', 'approve', job.id)).toThrow(
    'cannot approve',
  )
  api.act('Operator', 'approve', job.id)
  expect(() => api.act('Operator', 'approve', job.id)).toThrow(
    'already running',
  )
  expect(api.get(job.id).progress).toBe(0)
  vi.runAllTimers()
  expect(api.get(job.id)).toMatchObject({
    phase: 'done',
    outcome: 'failure',
    progress: 100,
  })
  expect(() => api.act('Developer', 'rollback', job.id)).toThrow(
    'cannot rollback',
  )
  api.act('Operator', 'rollback', job.id)
  vi.runAllTimers()
  const recovery = api.list()[0]
  expect(recovery).toMatchObject({
    rollbackOf: job.id,
    version: '1.8.0',
    outcome: 'success',
  })
  expect(api.get(job.id)).toMatchObject({
    rollbackId: recovery.id,
    outcome: 'failure',
  })
  expect(() => api.act('Operator', 'rollback', job.id)).toThrow('not eligible')
})

test.each([9, 10])(
  'idempotent rollback insertion into a page with %i rows',
  (count) => {
    const api = createSimulation()
    const snapshot = api.list().slice(0, count)
    const rollback: Job = {
      ...snapshot[0],
      id: 'DEP-012',
      order: 12,
      rollbackOf: 'DEP-011',
    }
    const early = mergeJobs([], [rollback])
    const merged = mergeJobs(snapshot, [...early, rollback])
    const { rows, total } = jobPage(merged, 'Staging', '', 1, 10)
    expect(rows.map((job) => job.id)).toEqual([
      rollback.id,
      ...snapshot.slice(0, 9).map((job) => job.id),
    ])
    expect(total).toBe(count + 1)
    expect(jobPage(merged, 'Production', '', 1, 10).rows).toEqual([])
  },
)

test('reset cancels simulation and prevents old listeners from getting new job events', () => {
  vi.useFakeTimers()
  const api = createSimulation()
  const job = api.create('Developer', REQUEST)
  const receive = vi.fn()
  api.subscribe(new Set([job.id]), receive)
  api.act('Operator', 'approve', job.id)
  receive.mockClear()
  api.reset()
  const newJob = api.create('Developer', REQUEST)
  api.act('Operator', 'approve', newJob.id)
  vi.runAllTimers()
  expect(receive).not.toHaveBeenCalled()
  expect(api.get(newJob.id).outcome).toBe('failure')
})
