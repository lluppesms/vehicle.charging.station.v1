# Project Context

- **Owner:** Lyle MS Luppes
- **Project:** vehicle.charging.station
- **Stack:** Client-first web app (JavaScript/TypeScript + HTML/CSS), final stack to be set during scaffolding
- **Created:** 2026-06-03

## Learnings

- PRD source of truth: `docs/prd-vehicle-charging.md`.
- Dashboard tab is the only fully implemented MVP surface in phase 1.
- Cars, Stations, Simulation, and Settings must be clickable, functional placeholders with clear future-stage text.
- 2026-06-03: Fixed cross-tick queue over-removal in `src/webapp/src/App.tsx` by replacing mixed `queuedCars` state + `queuedCarsRef` mutation paths with a single `useReducer` state machine. Tick now computes `assignedQueuedCars` and `remainingQueue` from one same-tick snapshot, then applies both slot assignment and dequeue exactly once to preserve FIFO across consecutive batches.
- 2026-06-04: Queue fix validated by Simon. Multi-batch FIFO behavior confirmed. Decision documented in decisions.md. Fix ready for merge.
