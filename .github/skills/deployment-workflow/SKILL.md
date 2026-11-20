---
name: deployment-workflow
description: Implement or debug this demo's deployment lifecycle, roles, MSW endpoints, snapshots, EventSource subscriptions, progress, rollback, Complete, and reset.
---

# Implement the deployment workflow

1. Check the lifecycle and roles in the [demo plan](../../../docs/plans/DEMO-PLAN.vi.md). Use the shared capability policy in UI and mock mutations. Keep execution phase, outcome, and Complete confirmation distinct. Creating a request leaves it `pending`; Approve starts the simulation.
2. Keep the MSW scenario deterministic and independent of reads or subscriptions. Make denied, invalid, duplicate, or conflicting mutations visible. Do not call real services.
3. Render the snapshot without waiting for SSE. Send IDs of `in-progress` jobs not already tracked even when the user has taken no action. Approve, Rollback, and Complete can also initiate tracking. Keep the stream open after a job ends and close it on navigation or reset.
4. Apply SSE updates by deployment ID to the data backing the UI. Retain events received before the snapshot and merge them once it arrives. Do not refetch the snapshot in response to an event, including terminal events. Reset must prevent old events or pending responses from repopulating the cache.
5. Rollback creates a new job linked to the failed job and redeploys the previous successful build. The failed job keeps its outcome. Prepend the new SSE record on the newest-first first page if it matches the filters, trim only rows beyond `pageSize`, and update duplicate IDs in place. Trimming affects only displayed rows, not source records.
6. Add focused tests for the changed contract, then exercise the relevant part of the walkthrough.
