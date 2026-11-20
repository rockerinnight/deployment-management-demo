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
| Server state | TanStack Query | Fetching, caching, mutations, invalidation, and progress polling |
| Global state | Zustand | Demo identity and role selection only |
| Forms | React Hook Form + Zod | Typed form validation and dependent field handling |
| Mock API | Mock Service Worker (MSW) | HTTP-shaped API behavior without a real backend |
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
- Deployment request form with application, environment, and release version.
- Deployment detail page with lifecycle timeline and sanitized simulated logs.
- Deterministic success and failure scenarios.
- Operator/Admin rollback of an eligible failed release.
- Explicit loading, empty, validation, unauthorized, and API-error states.
- Reset-demo action that restores seed data and clears cached results.

### Deferred

- User/team CRUD, project administration, and full server monitoring.
- Real authentication, backend authorization, and production deployment execution.
- CI/CD integrations, SSH, containers, cloud accounts, and actual infrastructure.
- Live log transport, production observability, and multi-user collaboration.

No operation in this demo deploys software or changes a real server.

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
| Roll back an eligible failed release | Yes | Yes | No |

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
3. Open deployments; filter to Orders API in Staging.
4. Request release 1.9.0 using the labeled simulated-failure scenario.
5. Attempt an incomplete submission to demonstrate useful validation feedback.
6. Submit a valid request; disable duplicate submission while pending.
7. Navigate to the new deployment detail page.
8. Observe Queued -> Running -> Failed, with a health-check failure in mock logs.
9. Show that Developer cannot request production or perform rollback.
10. Switch to Operator without losing the selected deployment.
11. Confirm rollback to the known healthy release 1.8.0.
12. Observe Rolling back -> Rolled back and the active release returning to 1.8.0.
13. Show refreshed deployment history and dashboard metrics.

### Supporting happy path

Request a staging release using the success scenario and observe:
Queued -> Running -> Succeeded.

### Lifecycle contract

- A failed demo release represents a candidate activated before a failed health
  check; an explicit rollback restores the last known healthy release.
- Rollback is available only for the latest eligible failed deployment with a
  known healthy predecessor and no conflicting active operation.
- Reject invalid transitions, unauthorized actions, and duplicate active requests
  with explicit API errors and visible UI feedback.
- Use deterministic scenario timing, not random failures.
- Derive progression from timestamps when records are read; reading or polling
  must not itself advance the deployment.
- Stop progress polling when the operation becomes terminal.
- Reset cancels scenario activity, restores seed records, and clears query state.

## Implementation checklist

### 1. Scaffold and developer workflow

- [x] Create the planning document and initialize the local Git repository.
- [ ] Scaffold React + TypeScript with Vite.
- [ ] Configure strict TypeScript, path aliases, ESLint, and Prettier.
- [ ] Add dev, build, type-check, lint, test, and test:e2e scripts.
- [ ] Configure Vitest/Testing Library and Playwright.
- [ ] Add a README with setup, architecture, and demo limitations.

### 2. Domain model and mock API

- [ ] Define typed applications, environments, releases, deployments, and logs.
- [ ] Create fictional seed data including a healthy release and recent history.
- [ ] Define API endpoints for dashboard, list/detail, request, rollback, and reset.
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
- [ ] Build detail timeline, logs, and terminal-state-aware progress polling.
- [ ] Add rollback confirmation, eligibility feedback, and progress display.
- [ ] Invalidate affected detail/list/dashboard queries after mutations.
- [ ] Add loading, empty, unauthorized, failed-request, and retry UI.
- [ ] Add reset controls that leave the app in a known presentation state.

### 5. Focused verification

- [ ] Test denied production deployment and rollback, including mock API requests.
- [ ] Test dependent form values are cleared when upstream selections change.
- [ ] Test request validation and duplicate/conflicting operation rejection.
- [ ] Test failed-release rollback eligibility and restoration of healthy version.
- [ ] Test that terminal deployments stop progressing/polling.
- [ ] Test reset restores seeds and removes stale visible data.
- [ ] E2E: Developer failure -> Operator rollback -> refreshed dashboard/history.
- [ ] E2E: successful deployment and prohibited Developer actions.
- [ ] E2E: API failure is visible and retry succeeds without duplicate records.
- [ ] Run type-check, lint, focused tests, E2E tests, and production build.
- [ ] Rehearse against the production preview, not only the dev server.

### 6. Interview readiness

- [ ] Replace case-study placeholders with truthful personal experience.
- [ ] Prepare a short architecture diagram and decision notes in the README.
- [ ] Practice the walkthrough within 5-10 minutes.
- [ ] Capture backup screenshots after the UI is implemented.
- [ ] Verify all displayed data is fictional and logs contain no sensitive details.
- [ ] Verify the entire walkthrough works without corporate/cloud connectivity.

## Case studies

These are candidate topics. Only present them as past work after confirming they
match actual responsibilities; otherwise label them as demo design exercises.

### Case study 1: consistent role-based behavior

- Problem: users need different actions without contradictory UI behavior.
- Personal responsibility: [Fill in the exact scope you owned.]
- Alternatives: scattered role conditionals vs. a shared capability policy.
- Demo decision: shared policy for routes/actions, with mock request rejection.
- Evidence: Developer denied production and rollback; Operator can recover.
- Production distinction: authorization must be enforced by the real backend.
- Actual outcome or lesson: [Use verified evidence; no invented metrics.]

### Case study 2: state ownership and cache consistency

- Problem: deployment changes must appear consistently in detail, history, and
  summary views without duplicating server records in global state.
- Personal responsibility: [Fill in.]
- Alternatives: global-store copies/manual fetching vs. query-owned server state.
- Demo decision: TanStack Query for records, Zustand for demo identity, URL state
  for filters, and React Hook Form for inputs.
- Evidence: mutation feedback, refreshed views, reset behavior, and role changes.
- Trade-off: polling is simple for the demo; streaming may suit production logs.
- Actual outcome or lesson: [Fill in with a genuine example.]

### Case study 3: asynchronous failure and recovery UX

- Problem: users need to understand ongoing deployment status and safely recover
  from a failed release.
- Personal responsibility: [Fill in.]
- Alternatives: a single spinner vs. explicit lifecycle, timeline, and logs.
- Demo decision: deterministic status transitions, visible errors, eligibility
  checks, and confirmed rollback.
- Evidence: failure -> role change -> rollback -> healthy release restored.
- Trade-off: rollback semantics depend on the deployment backend; this simplified
  scenario does not model database migrations or distributed-system recovery.
- Actual outcome or lesson: [Fill in without claiming demo behavior was shipped.]

## Presentation order and timing

| Time | Segment | What to show or say |
| --- | --- | --- |
| 0:00-0:45 | Context and ownership | Business problem, actual contribution, reconstruction disclaimer |
| 0:45-1:30 | Architecture | Feature modules, state ownership, mock API boundary |
| 1:30-4:30 | Main workflow | Developer request, validation, progress, failed health check |
| 4:30-6:00 | Recovery and permissions | Operator switch, confirmed rollback, refreshed state |
| 6:00-7:30 | Engineering evidence | Shared policy, query hooks, form schema, focused tests |
| 7:30-8:30 | Trade-offs and lessons | Mock vs. production, polling, backend enforcement, actual lessons |
| 8:30-10:00 | Questions or happy path | Optional success scenario and interviewer discussion |

For a five-minute slot, omit the live code tour and optional happy path. Cover
context, failed deployment, role restriction, rollback, and one key trade-off.

## Demo plan

### Before the interview

1. Install dependencies and browser test prerequisites ahead of time.
2. Run the documented checks and build the production bundle.
3. Start production preview using the documented local command.
4. Confirm the mock service worker intercepts requests in the preview build.
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
