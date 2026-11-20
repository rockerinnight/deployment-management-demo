import { http, HttpResponse, sse, type JsonBodyType } from 'msw'
import { setupWorker } from 'msw/browser'
import { requestSchema } from '../features/deployment/model'
import { ROLES, type Role } from '../shared/policy'
import { createSimulation, DemoError } from './simulation'

const simulation = createSimulation()
let generation = 0

function roleOf(request: Request): Role {
  const role = ROLES.find(
    (candidate) => candidate === request.headers.get('x-demo-role'),
  )
  if (!role) throw new DemoError(403, 'Select a valid demo role.')
  return role
}

async function respond(operation: () => JsonBodyType | Promise<JsonBodyType>) {
  try {
    return HttpResponse.json(await operation())
  } catch (error) {
    if (!(error instanceof DemoError)) throw error
    return HttpResponse.json(
      { message: error.message },
      { status: error.status },
    )
  }
}

export const worker = setupWorker(
  http.get('/api/dashboard', () => HttpResponse.json(simulation.list())),
  http.get('/api/deployments', () => HttpResponse.json(simulation.list())),
  http.get('/api/deployments/:id', ({ params }) =>
    respond(() => [simulation.get(String(params.id))]),
  ),
  http.post('/api/deployments', ({ request }) =>
    respond(async () => {
      const startedIn = generation
      const fields = requestSchema.safeParse(
        await request.json().catch(() => undefined),
      )
      if (request.signal.aborted || startedIn !== generation)
        throw new DemoError(409, 'The deployment request was cancelled.')
      if (!fields.success)
        throw new DemoError(400, fields.error.issues[0].message)
      return simulation.create(roleOf(request), fields.data)
    }),
  ),
  http.post('/api/deployments/:id/:action', ({ params, request }) =>
    respond(() => {
      const action = params.action
      if (action !== 'approve' && action !== 'rollback')
        throw new DemoError(404, 'Unknown deployment action.')
      if (request.signal.aborted)
        throw new DemoError(409, 'The deployment action was cancelled.')
      simulation.act(roleOf(request), action, String(params.id))
      return { accepted: true }
    }),
  ),
  http.post('/api/reset', () => {
    generation++
    simulation.reset()
    return HttpResponse.json({ reset: true })
  }),
  sse('/api/progress', ({ request, client, finalize }) => {
    const ids = new Set(new URL(request.url).searchParams.getAll('id'))
    const unsubscribe = simulation.subscribe(ids, (job) =>
      client.send({ data: JSON.stringify(job) }),
    )
    finalize(unsubscribe)
  }),
)
