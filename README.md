# Deployment Management System demo

A standalone React, TypeScript, and Vite interview demo. All roles, deployments,
and logs are synthetic. Nothing is deployed, and the role switcher is not authentication.

## Run locally

Use Node.js 24 and npm.

```sh
npm ci
npm run build
npm run preview
```

Open the localhost URL printed by Vite. After the initial install, the demo does
not require external services. Use `npm run dev` for development.

## Walkthrough

1. Select **Reset demo**. As **Developer**, open **Add new** in **Deployments**.
2. Try submitting without all required fields. Then choose **Orders API**,
   **Staging**, version `1.9.0`, and **Simulated health check failure**.
3. Switch to **Operator** on the request detail page. Select **Approve** and watch
   progress and the failed health check.
4. Return to **Deployments**, filter to **Staging**, and choose **Rollback** on
   the failed row. Confirm **Roll back**. The recovery job appears at the top
   and restores `1.8.0`; the original job remains failed.
5. Open the recovery job or check **Dashboard** for the updated deployment totals.

Reset or reload restores the seed data. This first slice does not include
Complete, Reject, Re-deploy, or the standalone success scenario.

## Architecture and checks

- MSW serves mock HTTP snapshots and SSE on localhost, including in the
  production build. Simulation timers advance independently of subscriptions.
- TanStack Query keeps each view's snapshot and revisioned SSE updates; events
  merge by deployment ID without triggering another snapshot request. List
  filters and pagination live in the URL.
- Zustand stores the demo role; the UI and mock mutations share one capability
  policy. React Hook Form and Zod handle request validation.

```sh
npm run type-check
npm run lint
npm test
npx playwright install chromium
npm run build
npm run test:e2e
```

The Playwright suite starts Vite production preview on port 4175. Set
`PLAYWRIGHT_CHANNEL=msedge` to use an installed Microsoft Edge instead.
