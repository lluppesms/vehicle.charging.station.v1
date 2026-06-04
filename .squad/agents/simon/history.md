# Project Context

- **Owner:** Lyle MS Luppes
- **Project:** vehicle.charging.station
- **Stack:** Client-first web app (JavaScript/TypeScript + HTML/CSS), final stack to be set during scaffolding
- **Created:** 2026-06-03

## Learnings

- PRD source of truth: `docs/prd-vehicle-charging.md`.
- MVP acceptance requires complete Dashboard simulation behavior and explicit placeholder messaging on non-Dashboard tabs.
- Placeholder tabs must still be navigable and render deterministic content.
- Queue behavior in `src/webapp/src/App.tsx` now enqueues cars when bays are full, dequeues FIFO (`queuedCars[0]`), and auto-assigns on bay availability via the queue watcher effect.
- Validation path for the webapp remains `npm run lint` and `npm run build` from `src/webapp`, both passing on this review.
- Verified queue dequeue logic no longer drops extra entries: on tick, only up to open slots are assigned and only that count is removed from the FIFO queue.
- Reassigned queue fix (Mal) validated: with queue [A,B,C] and one bay opening, only A is assigned and remaining queue is exactly [B,C], preserving FIFO for subsequent openings.
- Simon QA re-validation (2026-06-03): multi-batch dequeue remains correct; each tick removes exactly the number of queue-head vehicles assigned to newly open bays, preserving FIFO across staged openings.
- 2026-06-04: Kaylee's queue cross-tick dequeue fix validated. Multi-batch FIFO behavior confirmed. useReducer snapshot approach eliminates race conditions. Ready for merge.
