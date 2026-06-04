# Project Context

- **Owner:** Lyle MS Luppes
- **Project:** vehicle.charging.station
- **Stack:** Client-first web app (JavaScript/TypeScript + HTML/CSS), final stack to be set during scaffolding
- **Created:** 2026-06-03

## Learnings

- PRD source of truth: `docs/prd-vehicle-charging.md`.
- Initial MVP scope is Dashboard-first; Cars, Stations, Simulation, and Settings are functional placeholders with future-stage messaging.
- Bootstrap stack decision for this repo: React + TypeScript + Vite in `src/webapp` for fast local startup and simple client-first iteration.
- Current MVP shell implementation path: `src/webapp/src/App.tsx` with tab routing, Dashboard metrics/cards, charging bay state, and roadway car assignment behavior.
- Local execution path is now standardized through `src/webapp/package.json` scripts (`dev`, `lint`, `build`).
- Bootstrap decision captured in `.squad/decisions.md` on 2026-06-03 and consolidated by Scribe.
- Orchestration log and session summary completed in `.squad/orchestration-log/` and `.squad/log/` for audit trail.
- Inara's graphics layer (CSS sprites, vehicle colors, charging bay scene polish) implements playful visual identity while preserving state flow and interaction logic.
- Visual design tokens (reusable car/truck sprite shapes, color palettes) scale cleanly for future variants without architecture changes.
- Queue stability requires deriving dequeue directly from the same queue snapshot used for bay assignment in a tick; assignment count must drive head removal count.
- Using `queuedCarsRef` as the mutation source for both enqueue and dequeue avoids stale-state queue replacement during concurrent timer/user updates.
