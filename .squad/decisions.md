# Squad Decisions

## Active Decisions

### Mal Decision: Client-first React/Vite Bootstrap

- **Timestamp:** 2026-06-03T16:45:32.474-05:00
- **Owner:** Mal (Lead)
- **Scope:** MVP bootstrap and shell architecture

Use a React + TypeScript + Vite client-first application scaffold in `src/webapp` as the initial simulator foundation.

**Why:**
- Fast startup (`npm run dev`) supports workshop demo cadence.
- TypeScript creates clearer contracts for upcoming simulation state transitions.
- Vite keeps tooling minimal while providing production build and lint paths immediately.

**Trade-offs:**
- No backend persistence in this phase (browser-memory only by design).
- No formal test runner added yet to keep scope minimal for MVP shell bootstrap.

**Deferred:**
- Full vehicle lifecycle choreography and configurability from PRD should land in subsequent implementation slices.
- Tab areas (Cars, Stations, Simulation, Settings) remain intentionally placeholder-only in this stage.

### Inara Decision: Dashboard Vehicle Graphics Layer

- **Timestamp:** 2026-06-03T17:10:04.753-05:00
- **Owner:** Inara (Designer)
- **Scope:** Dashboard visual layer only

Adopt reusable CSS vehicle sprites (`car` and `truck`) with per-vehicle color tokens so roadway traffic and bay occupancy are visually recognizable without changing simulator state flow.

**Why:**
- Improves instant scene readability under motion versus text-only moving pills.
- Keeps dashboard playful while preserving battery/status legibility and keyboard-accessible click targets.
- Scales cleanly for future visual variants without architecture rewrites.

**Trade-offs:**
- Adds CSS complexity for sprite styling and lane composition.
- Uses modern CSS color mixing for richer shading in supported browsers.

### Inara Decision: Live-Target-State Visual System Direction

- **Timestamp:** 2026-06-03T17:20:23.526-05:00
- **Owner:** Inara (Designer)
- **Scope:** Dashboard visual language evolution
- **Status:** Ratified

Converge the Dashboard UI toward a dark cinematic operations look using reusable tokens (steel-blue surfaces, cyan edge lighting, frosted borders, layered shadows) while preserving all MVP interactions and information density.

**Why this direction:**
- Better matches the target-state composition and mood from `docs/images/live-target-state.png`.
- Improves readability under animated traffic motion by increasing contrast and depth cues.
- Keeps future iteration cheap by centralizing palette and elevation into shared CSS tokens.
- Provides production-like operations aesthetic without reducing legibility or interaction patterns.

**Implementation:**
- Reusable design tokens in `index.css` for text hierarchy, surface styling, borders, and shadows
- Glassy panels with frosted borders and layered shadows in header, tabs, metrics, and status areas
- Richer bay/roadway scene composition with improved depth perception and motion clarity
- All existing click-to-charge and assignment flows preserved

**Trade-offs:**
- Slightly higher CSS complexity due to layered gradients and lighting effects.
- Requires deliberate restraint in future additions to avoid over-glowing the interface.

### Kaylee Decision: Queue Cross-Tick Dequeue Fix

- **Timestamp:** 2026-06-04T08:09:14.984-05:00
- **Owner:** Kaylee (Backend Dev)
- **Scope:** `src/webapp/src/App.tsx` queue dequeue logic
- **Status:** Validated by Simon

Queue dequeue logic used mixed state/ref mutation (`queuedCars` + `queuedCarsRef`) inside nested state updaters and interval ticks, causing cross-tick drift and non-deterministic dequeue counts after the first successful batch.

**Decision:**
Use a single `useReducer` simulation state as the source of truth for slots, queue, roadway cars, totals, and next vehicle id. In each `tick` action:
1. Compute completed sessions and newly open slots
2. Snapshot `assignedQueuedCars` from current queue
3. Slice `remainingQueue = queue.slice(assignedQueuedCars.length)`
4. Assign slots using only `assignedQueuedCars`

**Consequence:**
Each tick dequeues exactly the number of queued vehicles assigned in that same tick, with FIFO preserved across consecutive batches and no mixed updater/ref path.

**Why:**
- Prevents stale-state replacement during timer ticks.
- Synchronizes functional queue updates with current state.
- Enforces strict FIFO and prevents over-removal during concurrent timer and user-driven updates.

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
