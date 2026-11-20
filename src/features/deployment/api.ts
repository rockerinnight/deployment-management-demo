import type { Role } from '../../shared/policy'
import type { Action, Job, RequestFields } from './model'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/${path}`, init)
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message ?? `Request failed (${response.status}).`)
  }
  return response.json()
}

export function getJobs(scope: string, signal: AbortSignal) {
  const path =
    scope === 'dashboard'
      ? 'dashboard'
      : scope === 'list'
        ? 'deployments'
        : `deployments/${encodeURIComponent(scope)}`
  return request<Job[]>(path, { signal })
}

export function createJob(
  fields: RequestFields,
  role: Role,
  signal: AbortSignal,
) {
  return request<Job>('deployments', {
    method: 'POST',
    signal,
    body: JSON.stringify(fields),
    headers: { 'Content-Type': 'application/json', 'X-Demo-Role': role },
  })
}

export function actOnJob(
  id: string,
  action: Action,
  role: Role,
  signal: AbortSignal,
) {
  return request(`deployments/${encodeURIComponent(id)}/${action}`, {
    method: 'POST',
    signal,
    headers: { 'X-Demo-Role': role },
  })
}

export function resetDemo() {
  return request('reset', { method: 'POST' })
}

export function openProgress(ids: string[]) {
  return new EventSource(
    `/api/progress?${new URLSearchParams(ids.map((id) => ['id', id]))}`,
  )
}
