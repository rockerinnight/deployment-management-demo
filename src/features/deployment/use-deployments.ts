import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { skipToken, useQuery, useQueryClient } from '@tanstack/react-query'
import { getJobs, openProgress } from './api'
import { mergeJobs, type Job } from './model'

export function useDeployments(scope: string) {
  const client = useQueryClient()
  const viewId = useId()
  const [streamError, setStreamError] = useState(false)
  const controller = useRef<AbortController | null>(null)
  const tracked = useRef(new Set<string>())
  const streams = useRef(new Set<EventSource>())
  const snapshot = useQuery({
    queryKey: ['deployments', scope, viewId],
    queryFn: ({ signal }) => getJobs(scope, signal),
  })
  const { data: events } = useQuery<Job[]>({
    queryKey: ['progress', viewId],
    queryFn: skipToken,
  })
  const track = useCallback(
    (ids: string[]) => {
      const untracked = [...new Set(ids)].filter(
        (id) => !tracked.current.has(id),
      )
      if (
        !untracked.length ||
        !controller.current ||
        controller.current.signal.aborted
      )
        return
      untracked.forEach((id) => tracked.current.add(id))
      const stream = openProgress(untracked)
      streams.current.add(stream)
      const { signal } = controller.current
      stream.onmessage = ({ data }) => {
        if (signal.aborted) return
        const event: Job = JSON.parse(data)
        client.setQueryData<Job[]>(['progress', viewId], (current) =>
          mergeJobs(current ?? [], [event]),
        )
      }
      stream.onopen = () => {
        if (!signal.aborted) setStreamError(false)
      }
      stream.onerror = () => {
        if (!signal.aborted) setStreamError(true)
      }
    },
    [client, viewId],
  )

  useLayoutEffect(() => {
    const sources = streams.current
    const ids = tracked.current
    const lifetime = new AbortController()
    controller.current = lifetime
    return () => {
      lifetime.abort()
      sources.forEach((stream) => stream.close())
      sources.clear()
      ids.clear()
    }
  }, [])

  const jobs = useMemo(
    () => snapshot.data && mergeJobs(snapshot.data, events ?? []),
    [snapshot.data, events],
  )
  useEffect(() => {
    track(
      jobs?.filter((job) => job.phase === 'in-progress').map((job) => job.id) ??
        [],
    )
  }, [jobs, track])

  function getSignal() {
    if (!controller.current)
      throw new Error('The deployment view is not available.')
    return controller.current.signal
  }

  return { snapshot, jobs, track, streamError, getSignal }
}
