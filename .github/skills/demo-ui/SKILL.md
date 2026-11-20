---
name: demo-ui
description: Build or review UI for this demo using the six archived screenshots and the demo plan. Use for layout, pages, styling, forms, tables, dialogs, UI states, and extracting repeated components.
---

# Build demo UI

1. Read the relevant screen and flow in the [demo plan](../../../docs/plans/DEMO-PLAN.vi.md). Use only the six local screenshots below as visual design references. Do not open Figma or use the VS Code Integrated Browser to inspect the design. Preserve demo behavior and use the plan for states not shown in the screenshots.
2. Search the existing feature and shared UI before adding a component. On the second use of the same UI pattern, extract a base and migrate both usages. Prefer a small typed API for the variations actually used: content, labels, actions, or presentation. Use Ant Design directly if it already supplies the common behavior.
3. Keep UI that depends on one feature's models or actions in that feature; put reusable presentation without those dependencies in `src/shared/ui`. Keep fetching, mutations, permissions, and SSE out of generic bases.
4. Apply shared theme tokens and CSS Modules. Treat the screenshots as visual references, not copy: write all UI text in English, including accessible names, status labels, validation, and error messages. Never reproduce Korean text from a screenshot. Check keyboard operation and ensure status text works without color. Cover the loading, empty, permission, error, and pending-action states relevant to the screen.
5. When the app runs, compare the affected screen with the corresponding local screenshot. Check both uses of an extracted base and run the relevant component tests.

## Local UI references

These screenshots are kept in the Git-ignored archive. Do not commit or bundle them. If a file is missing, request the screenshot instead of switching to Figma.

| Screenshot | Use |
| --- | --- |
| [01-login.png](../../../docs/archives/ui-reference/01-login.png) | Blue/teal palette only; do not build a login screen. |
| [02-deployment-list.png](../../../docs/archives/ui-reference/02-deployment-list.png) | Navigation, filters, table, row actions, progress, and pagination. |
| [03-status-badges.png](../../../docs/archives/ui-reference/03-status-badges.png) | Badge anatomy and semantic colors for in-scope states. |
| [04-deployment-detail.png](../../../docs/archives/ui-reference/04-deployment-detail.png) | Detail layout and action placement. |
| [05-create-deployment-dialog.png](../../../docs/archives/ui-reference/05-create-deployment-dialog.png) | Dialog layout opened by **Add new**. Use the blue/teal theme, not the old red header, and keep only MVP fields. |
| [06-dashboard.png](../../../docs/archives/ui-reference/06-dashboard.png) | Layout only: deployment summary above recent activity. Use the current blue/teal theme and English copy; omit filters and organization metrics outside the dashboard MVP. |
