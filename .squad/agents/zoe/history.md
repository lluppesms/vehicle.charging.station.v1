# Project Context

- **Owner:** Lyle MS Luppes
- **Project:** vehicle.charging.station
- **Stack:** Client-first web app (JavaScript/TypeScript + HTML/CSS), final stack to be set during scaffolding
- **Created:** 2026-06-03

## Learnings

- PRD source of truth: `docs/prd-vehicle-charging.md`.
- Dashboard MVP must include car spawning, click-to-charge flow, charging progression, and cumulative energy metrics.
- Placeholder tabs stay functional but defer full features to later stages.
- Dashboard charging intake now uses a FIFO holding queue: clicked vehicles are removed from roadway and wait when all bays are occupied, then auto-dock when a bay opens.
- Queue mutations in timer-driven simulation must use functional state updates (not snapshot replacement) to avoid stale overwrites dropping queued vehicles.
