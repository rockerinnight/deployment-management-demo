---
name: verify-demo
description: Verify the deployment demo, write focused tests, or rehearse the interview walkthrough against the local Vite production preview.
---

# Verify the demo

1. For a change, start with the smallest relevant existing Vitest, React Testing Library, or Playwright check. Prefer assertions on visible behavior or request contracts; report checks that could not run.
2. When changing progress or rollback, check the relevant cases: snapshot renders without SSE, running IDs are subscribed on load, either source can arrive first, SSE does not request another snapshot, and navigation/reset cleans up the stream. For `pageSize = 10`, verify 10 + 1 drops one visible row, 9 + 1 drops none, and repeated events do not duplicate or trim rows.
3. For demo readiness, run the project's type-check, lint, test, E2E, and build scripts once available. Use `npm run build` then `npm run preview`; open the printed localhost URL. Confirm MSW intercepts requests, the browser receives progress events during execution, and no external API is required. No hosted deployment is needed.
4. Follow the [demo plan](../../../docs/plans/DEMO-PLAN.vi.md): reset, create an invalid then valid Staging request as Developer, switch to Operator, approve, observe the simulated failure, roll back to the healthy build, and check the new job and updated views. Verify that Complete locks changes but not log viewing. Rehearse the shorter run without optional parts if limited to five minutes.
