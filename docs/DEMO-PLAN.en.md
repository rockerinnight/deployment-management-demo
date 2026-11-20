# Deployment Management System - Interview Demo Plan

For the Vietnamese version, see [DEMO-PLAN.vi.md](./DEMO-PLAN.vi.md).

## Purpose and boundaries

Create an independent, interview-ready frontend reconstruction inspired by prior
Deployment Management System experience. Demonstrate engineering decisions through
one complete deployment workflow rather than rebuilding every corporate feature.

This is fresh demo code, not the original corporate application. Use fictional
organizations, users, applications, servers, environments, versions, and logs.
Do not copy corporate source, branding, internal addresses, credentials, or
proprietary business rules.

Distinguish original work experience from newly implemented demo features.
Do not claim unverified business outcomes or performance improvements.

The original is a full-stack system integrated with Jenkins; this demo only
reconstructs the frontend workflow. Keep original archive material out of any
public demo distribution.

## Target outcome

- A reliable 5-10 minute local walkthrough without external service dependencies.
- A polished deployment workflow with permissions, validation, progress, failure,
  and rollback.
- Clear feature boundaries and deliberate state ownership.
- Focused automated tests and repeatable demo scenarios.
- An architecture README explaining decisions, limitations, and local commands.

## Technology stack

| Concern | Choice | Purpose |
| --- | --- | --- |
| UI | React + TypeScript + Vite | Typed, maintainable frontend with fast local development |
| Components | Ant Design | Consistent tables, forms, layout, feedback, and status indicators |
| Styling | CSS Modules + small global stylesheet | Scoped customization and shared design tokens |
| Routing | React Router | Feature routes, route guards, and detail-page navigation |
| Server state | TanStack Query | Snapshot fetching, caching, mutations, and invalidation |
| Deployment progress | EventSource (SSE) | Receive pushed updates by deployment ID without polling |
| Global state | Zustand | Demo identity and role selection only |
| Forms | React Hook Form + Zod | Typed form validation and dependent field handling |
| Mock API | Mock Service Worker (MSW) | Mock snapshot and mutation APIs and the HTTP SSE stream |
| Unit/component tests | Vitest + React Testing Library | Permission rules, validation, and interaction behavior |
| End-to-end tests | Playwright | Verify the interview workflow in a browser |
| Code quality | ESLint + Prettier + strict TypeScript | Consistent code and type checking |

Select compatible, maintained package versions when scaffolding; do not reproduce
old versions solely because they appeared in the original README.

## MVP scope

### Included

- Persistent application shell with navigation and a clear "Interview demo" badge.
- Demo identity/role switcher for Admin, Operator, and Developer.
- Route and action permission checks driven by one shared policy.
- Small dashboard: deployment summary and recent activity.
- Deployment list: environment/status filters and pagination.
- Deployment request form in a dialog opened by **Add new** on the list, with
  application, environment, release version, and simulation scenario fields.
- Deployment detail page with lifecycle timeline and sanitized simulated logs.
- Snapshot data combined with EventSource updates on dashboard, list, and
  detail for jobs already in progress or actions that need tracking.
- Deterministic success and failure scenarios.
- Operator/Admin rollback of an eligible failed release.
- Explicit loading, empty, validation, unauthorized, and API-error states.
- Reset-demo action that restores seed data and clears cached results.

### Deferred

- User/team CRUD, project administration, and full server monitoring.
- Real authentication, backend authorization, and production deployment execution.
- CI/CD integrations, SSH, containers, cloud accounts, and actual infrastructure.
- Reject, Re-deploy, and the original system's full approve/complete rules.
- Live log transport, production observability, and multi-user collaboration.

No operation in this demo deploys software or changes a real server.

### UI references

- Use the blue/teal references for the top navigation, table, status badges,
  and detail layout. Do not copy company branding, user names, or original
  data. The login image is a color reference only; the demo uses a role
  switcher, not a login screen.
- Image 5 is a layout reference for the request dialog, not a color
  reference. Apply the same blue/teal theme to its header and primary action
  and reserve red for errors or failed states. Do not add fields outside
  the MVP just because they appear in the reference.
- Image 6 is a layout reference for the dashboard: total, in-progress,
  successful, and failed job counts above recent activity with detail links.
  Use the blue/teal theme and English copy. Omit dashboard filters, success
  rate, and aggregate counts for teams, projects, and applications.

## Architecture and state ownership

Use feature-based modules:

```text
src/
  app/                 # Providers, router, shell, demo identity store
  features/
    dashboard/
    deployment/        # API functions, models, hooks, schemas, components, pages
  shared/              # Permission policy, API client, reusable UI
  mocks/               # MSW handlers, fictional seed data, scenario engine
```

- TanStack Query owns deployment records and dashboard data.
- The dashboard, list, and detail views fetch separate snapshots. Snapshot and
  progress responses are independent and merged by deployment ID. When a
  snapshot contains `in-progress` jobs, send any IDs not already tracked to
  the progress API without waiting for user action. Approve, Rollback, and
  Complete can also start tracking. For rollback, use the new job ID from
  the SSE payload to insert the row and apply subsequent updates.
- Render as soon as the snapshot is available, even for an `in-progress` job.
  Merge SSE updates into the displayed data by deployment ID. If an event
  arrives first, retain it until the snapshot arrives. Do not wait for SSE to
  render or refetch the snapshot in response to an SSE event, including when a job ends.
- Zustand owns the selected demo identity, not copies of server data.
- React Hook Form owns form input and validation state.
- URL search parameters own list filters and pagination.
- Local component state owns transient presentation details.
- API functions and mock handlers remain separate so a future real API can
  replace MSW without rewriting feature UI.
- Use kebab-case filenames, PascalCase components, camelCase functions, and
  UPPER_SNAKE_CASE constants.

## Demo permission policy

This table is a demo design, not a claim about the original company's policy.

| Capability | Admin | Operator | Developer |
| --- | --- | --- | --- |
| View dashboard, deployments, and logs | Yes | Yes | Yes |
| Request a staging deployment | Yes | Yes | Yes |
| Request a production deployment | Yes | Yes | No |
| Approve a pending request | Yes | Yes | No |
| Roll back an eligible failed release | Yes | Yes | No |
| Complete an eligible successful job | Yes | Yes | No |

Use the same policy for navigation, route access, and action availability.
Mock API handlers also reject unauthorized mutations so the demo can show the
expected request/response contract.

Demo role switching is not authentication. Neither frontend guards nor browser
mock handlers provide real security. A production backend must authenticate users
and enforce permissions independently.

## End-to-end story

### Fictional setup

- Project: Aurora Commerce.
- Application: Orders API.
- Environments: Staging and Production.
- Last healthy staging release: 1.8.0.
- Candidate release: 1.9.0.
- Personas: a Developer, an Operator, and an Admin.

### Main walkthrough: failed deployment and recovery

1. Reset the demo and select Developer.
2. Open the dashboard and inspect recent deployment activity.
3. Open deployments and filter by the Staging environment.
4. Select **Add new** to open the dialog, choose Orders API, and submit with fields missing to
   demonstrate useful validation feedback.
5. Complete the form for release 1.9.0 and select the labeled simulated-failure scenario.
6. Submit the valid request; disable duplicate submission while it is pending.
7. Open the `pending` job. Show that Developer cannot approve it or request
   Production. Switch to Operator without losing the selected job.
8. Select Approve to start the job and open EventSource. Follow progress from
   0% to 100% and the `in-progress` -> `done` transition; the mock logs show that
   the job ended with a health-check failure.
9. Confirm Rollback. The new job redeploys build 1.8.0, appears at the top of
   the Staging table from an SSE event, and is tracked under its new ID. The
   1.9.0 job keeps its failed outcome and links to the new job.
10. Verify the active build is 1.8.0 and the dashboard and history are current.
    If time allows, select Complete on the successful recovery job to confirm
    review and lock further changes to it; logs remain readable.

### Supporting happy path

Create a staging request using the success scenario. As Operator, select
Approve and follow `pending` -> `in-progress` -> `done` with a successful outcome.

### Lifecycle contract

- Creating a request only records a `pending` job. Approve starts execution and
  tracking from 0% to 100%. `done` means execution ended, not that it succeeded
  or was marked Complete. Store execution outcome and confirmation separately.
- Complete confirms that a job was reviewed; it does not rerun it. The demo
  allows Complete only after a successful run. Once confirmed, the API rejects
  actions that would change the job, while logs remain readable.

- A failed demo release represents a candidate activated before a failed health
  check. Rollback creates a separate job with its own ID, links it to the failed
  job, and redeploys the last successful build rather than the failed build.
  Record recovery only once the rollback job succeeds.
- On the first page sorted newest first, prepend the rollback row from the
  event to the displayed list if it matches the filters. Trim only rows beyond
  `pageSize` from the bottom; do not remove rows if the page has room. Repeated
  events update by ID without inserting or trimming more rows. No source records are deleted.
- Rollback is available only for the latest eligible failed deployment with a
  known healthy predecessor and no conflicting active operation.
- Reject invalid transitions, unauthorized actions, and duplicate active requests
  with explicit API errors and visible UI feedback.
- The scenario engine advances on a deterministic schedule and emits events on
  status changes, even when no screen is subscribed. Reading a snapshot or
  subscribing to SSE does not advance the deployment.
- Once opened, keep the stream open until the user leaves the page, even after
  the job ends. No new events is normal when the data has not changed.
- Reset closes the stream, cancels scenario work and pending requests, restores
  seeds, and clears query state. Old responses must not repopulate the cache.

## Implementation checklist

### 1. Scaffold and developer workflow

- [x] Create the planning document and initialize the local Git repository.
- [ ] Scaffold React + TypeScript with Vite.
- [ ] Configure strict TypeScript, path aliases, ESLint, and Prettier.
- [ ] Add dev, build, preview, type-check, lint, test, and test:e2e scripts.
- [ ] Configure Vitest/Testing Library and Playwright.
- [ ] Add a README with setup, architecture, and demo limitations.

### 2. Domain model and mock API

- [ ] Define typed applications, environments, releases, deployments, and logs.
- [ ] Create fictional seed data including a healthy release and recent history.
- [ ] Define dashboard/list/detail snapshot endpoints, an SSE endpoint, and
  endpoints for request creation, Approve, Rollback, Complete, and reset.
- [ ] Implement deterministic success/failure progression and rollback eligibility.
- [ ] Implement pagination/filtering and stable ordering.
- [ ] Add configurable demo latency and a labeled one-shot API-error scenario.
- [ ] Return explicit validation, permission, conflict, and not-found errors.
- [ ] Define reload behavior: restore fictional seed state and clearly document it.

### 3. Application shell and permissions

- [ ] Add the shell, dashboard/list/detail routes, and not-found page.
- [ ] Add the demo identity switcher and non-production badge.
- [ ] Centralize permission checks and apply route/action guards.
- [ ] Clear identity-sensitive query state on role switching.
- [ ] Preserve safe navigation context when changing roles.
- [ ] Add accessible labels, keyboard navigation, and readable status text.

### 4. Deployment workflow

- [ ] Build dashboard summaries and recent activity.
- [ ] Build the deployment table with URL-backed filters and pagination.
- [ ] Build the validated form with dependent application/environment/version fields.
- [ ] Prevent duplicate submissions and display mutation errors.
- [ ] Add the timeline, logs, percentage, and EventSource tracking from snapshots
  or actions to all three views; add Approve and Complete confirmation.
- [ ] Add rollback confirmation, track the new ID, and prepend the row when filters match.
- [ ] Invalidate affected queries for mutations not reflected via SSE. For
  actions with SSE, update the displayed data without refetching the snapshot.
- [ ] Add loading, empty, unauthorized, failed-request, and retry UI.
- [ ] Add reset controls that leave the app in a known presentation state.

### 5. Focused verification

- [ ] Test denied production deployment and rollback, including mock API requests.
- [ ] Test dependent form values are cleared when upstream selections change.
- [ ] Test request validation and duplicate/conflicting operation rejection.
- [ ] Test Rollback creates a new job, repeated events produce one row, and the
  failed outcome is preserved; Complete blocks further changes but allows viewing logs.
- [ ] With `pageSize = 10`, test that 10 rows plus one rollback job trims
  exactly one row, while 9 rows plus one job trims none. SSE does not refetch the snapshot.
- [ ] Test that `in-progress` jobs from snapshots are tracked without user
  action or duplicate subscriptions, and that actions can still start tracking.
  Verify the stream stays open after the job ends and closes on navigation;
  snapshots render without SSE and updates merge correctly in either arrival order.
- [ ] Test reset with an open stream or pending requests so stale data cannot reappear.
- [ ] E2E: Developer request -> Operator Approve -> failure -> Rollback ->
  new row and updated dashboard/history.
- [ ] E2E: successful deployment and prohibited Developer actions.
- [ ] E2E: API failure is visible and retry succeeds without duplicate records.
- [ ] Verify SSE early on the local Vite production preview as soon as the
  Approve → failure → Rollback flow works. Check that updates appear while
  the job runs, the rollback job appears at the top without exceeding
  `pageSize`, and SSE events do not trigger snapshot requests.
- [ ] Run type-check, lint, focused tests, E2E tests, and production build.
- [ ] Rehearse against the production preview, not only the dev server.

### 6. Interview readiness

- [ ] Rehearse case-study wording that separates actual experience from demo design.
- [ ] Prepare a short architecture diagram and decision notes in the README.
- [ ] Practice the walkthrough within 5-10 minutes.
- [ ] Capture backup screenshots after the UI is implemented.
- [ ] Verify all displayed data is fictional and logs contain no sensitive details.
- [ ] Verify the entire walkthrough works without corporate/cloud connectivity.

## Case studies

Responsibilities and actual outcomes describe the original system. Demo
decisions and evidence are separate and do not imply production behavior.

### Case study 1: consistent role-based behavior

- Problem: users need different actions without contradictory UI behavior.
- Personal responsibility: store the authenticated user's permissions in
  `authStore` and use them to show or hide actions in the frontend.
- Alternatives: scattered role conditionals vs. a shared capability policy.
- Demo decision: shared policy for routes/actions, with mock request rejection.
- Evidence: Developer denied production and rollback; Operator can recover.
- Ownership boundary: the backend validated the Bearer access token in the
  `Authorization` header and checked permissions on requests; I did not own it.
- Actual outcome: the UI offered only permitted actions; the backend enforced
  access limits on requests.

### Case study 2: state ownership and cache consistency

- Problem: deployment changes must appear consistently in detail, history, and
  summary views without duplicating server records in global state.
- Personal responsibility: fetch the separate snapshot API for each dashboard,
  list, and detail view. Track `in-progress` jobs from snapshots via
  `EventSource`; Approve, Reject, Rollback, and Complete can also start
  tracking. The progress response does not depend on the snapshot
  response; merge both for display. On rollback, prepend the new record from
  the progress response and remove the last visible row only if it exceeds `pageSize`.
- Alternatives: global-store copies/manual fetching vs. query-owned server state.
- Demo decision: TanStack Query holds snapshots and merged SSE updates; Zustand
  holds demo identity, the URL holds filters, and React Hook Form holds inputs.
- Evidence: Approve updates the progress percentage; rollback adds a row at
  the top of the table without a page reload.
- Trade-off: SSE pushes updates but requires connection lifecycle management
  and reconciliation after interruptions. The demo streams progress, not logs.
- Actual outcome: deployment progress and status updated in real time instead
  of remaining at the initial snapshot.

### Case study 3: asynchronous failure and recovery UX

- Problem: users need to understand ongoing deployment status and safely recover
  from a failed release.
- Personal responsibility: show each deployment's overall status (succeeded,
  failed, or in progress) and its last-column actions: view Jenkins logs,
  Approve, Reject, Complete, Rollback, and Re-deploy. All three roles could
  view logs; other actions depended on permissions and job conditions.
  Progress used CS2.
- Original behavior: rollback created a new deployment job to redeploy the
  previous successful build, not the build from the job selected for rollback.
- Approve started the job (`pending` -> `in-progress` -> `done`) with progress
  from 0% to 100%. Complete confirmed review of the job and locked other actions.
- Alternatives: a single spinner vs. explicit lifecycle, timeline, and logs.
- Demo decision: keep simulated logs and simplified Approve, Rollback, and
  Complete rules. Do not add buttons or APIs for Reject or Re-deploy.
  Rollback creates a new deployment job to redeploy the previous successful build.
- Evidence: failure -> role change -> rollback -> healthy release restored.
- Trade-off: rollback semantics depend on the deployment backend; this simplified
  scenario does not model database migrations or distributed-system recovery.
- Actual outcome: users could follow job progress and use Jenkins logs to
  identify failures and decide what to do next.

## Presentation order and timing

| Time | Segment | What to show or say |
| --- | --- | --- |
| 0:00-0:45 | Context and ownership | Business problem, actual contribution, reconstruction disclaimer |
| 0:45-1:30 | Architecture | Feature modules, state ownership, mock API boundary |
| 1:30-4:30 | Main workflow | Developer request, validation, Operator switch, Approve, and failed health check |
| 4:30-6:00 | Recovery | Rollback adds a job at the top of the table; verify recovery and show Complete if time allows |
| 6:00-7:30 | Engineering evidence | Shared policy, query hooks, form schema, focused tests |
| 7:30-8:30 | Trade-offs and lessons | Mock vs. production, SSE lifecycle, backend enforcement, actual lessons |
| 8:30-10:00 | Questions or happy path | Optional success scenario and interviewer discussion |

For a five-minute slot, omit the live code tour, Complete, and optional happy path. Cover
context, failed deployment, role restriction, rollback, and one key trade-off.

## Demo plan

### Before the interview

1. Install dependencies and browser test prerequisites ahead of time.
2. Run the documented checks and build the production bundle.
3. Once the Vite scripts exist, run `npm run build`, then `npm run preview`.
   Open the localhost URL printed by Vite; no deployment or domain is needed.
4. Confirm the mock service worker handles requests and the browser receives
   individual SSE events before the stream ends in the preview build.
5. Confirm no external API is required and no real deployment endpoint is used.
6. Reset and rehearse the complete main story.
7. Open the application plus a few relevant code/test tabs.
8. Keep backup screenshots and the presentation outline available.

### During the interview

- Begin with the business problem and your contribution, not a stack inventory.
- State once that data, authentication, and deployment execution are simulated.
- Explain decisions while demonstrating their visible consequences.
- Keep the failure scenario labeled; do not imply it is an unexpected outage.
- Show only a small amount of code tied directly to the case studies.
- Finish with trade-offs, real lessons, and what would change in production.

## Demo notes and fallback

- Roles are a presentation control; never describe the switcher as secure login.
- Status color must have accompanying text; do not rely only on color.
- Use short, predictable timings so the walkthrough does not depend on luck.
- Clearly distinguish deployment failure from an API/network request failure.
- Do not silently replace API errors with successful-looking data.
- Avoid optimistic terminal status updates; show API-confirmed outcomes.
- Reload restores demo seeds; reset also clears active in-memory scenarios/caches.
- If the browser demo fails, use backup screenshots and explain the code path
  honestly instead of pretending the workflow completed.
- Avoid live package installs, external services, or infrastructure changes during
  the interview.
- Do not claim "production-ready" security or operational reliability for a
  browser-only simulation.

## Definition of done

- The complete main story passes an automated browser test and a manual rehearsal.
- The production preview runs locally with fictional, deterministic data.
- Permissions, validation, failure, rollback, cache updates, and reset behave as
  specified above.
- Type checking, linting, tests, and production build pass.
- The README provides setup, architecture, demo instructions, and limitations.
- Case-study claims clearly separate verified past experience from demo additions.
