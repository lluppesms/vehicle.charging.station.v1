---
name: "dashboard-first-mvp-shell"
description: "Bootstrap a client-first tabbed app where Dashboard is functional and other tabs are intentional placeholders"
domain: "mvp-scoping"
confidence: "high"
source: "earned"
---

## Context
Use this pattern when a PRD requires one high-value tab to be real now while preserving future-tab navigation for scope visibility.

## Patterns
- Ship a complete runnable scaffold first (install, dev, lint, build scripts).
- Implement one production-leaning tab with real state, interactions, and metrics.
- Keep remaining tabs navigable with explicit future-stage messaging, not hidden routes.
- Keep simulation/state logic local to the Dashboard surface until broader architecture hardens.

## Examples
- `src/webapp/src/App.tsx`: tab model plus Dashboard-only working charging bay flow.
- `README.md`: quickstart commands targeting the app folder and script usage.

## Anti-Patterns
- Building all tabs partially and delivering no coherent MVP flow.
- Leaving non-MVP tabs as dead links instead of functional placeholders.
- Starting complex backend or persistence layers before validating Dashboard UX loop.
