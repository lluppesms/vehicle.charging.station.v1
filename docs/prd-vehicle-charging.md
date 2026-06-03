---
title: EV Charging Station Simulator Product Requirements Document
description: Product requirements for an interactive EV charging station web simulator with animated roadway traffic, clickable vehicle charging flow, and cumulative energy tracking
author: Workshop facilitator
ms.date: 2026-06-03
ms.topic: overview
keywords:
  - ev charging
  - simulator
  - product requirements
  - web application
  - animation
estimated_reading_time: 14
---

## Document Control

* File name: docs/prd-vehicle-charging.md
* Owner: Workshop facilitator
* Stakeholders: workshop participants, facilitator
* Status: Draft
* Created: 2026-06-03
* Last updated: 2026-06-03
* Target release or lab milestone: Lab 01, Simulator Foundation

## Summary

Build a fun, modern web application that simulates an electric vehicle charging station. Cars are created at regular intervals and move slowly along a roadway at the bottom of the page. When a user clicks a moving car, the selected car drives into an available charging bay, begins charging, and shows a live battery fill animation. After approximately one minute of simulated charging, the vehicle returns to the roadway. The experience includes a prominent cumulative counter for total energy dispensed across all completed charging sessions.

## Visual Direction

The UI should feel vibrant and playful while staying clear and easy to use. The target visual style includes:

* A bold charging station scene across the upper portion of the screen
* A traffic lane across the lower portion with continuous animated vehicle motion
* Neon-inspired accent lighting and status panels
* High-contrast readability for battery, power, and aggregate metrics
* Responsive behavior for desktop and mobile viewports

## Problem Statement

The simulator concept for this assignment should be car-centric. Cars should be created at regular intervals, enter the roadway, and proceed slowly across the screen until selected for charging. The project needs a visual, interactive charging station simulation with engaging animations and clear operational metrics.

## Goals

* Provide a single-page simulator where cars are generated at regular intervals, move slowly across the roadway, and can be selected for charging
* Animate a selected vehicle moving from roadway to station bay and then back to roadway on completion
* Display battery charge progression in real time while a vehicle is in a charging bay
* Track and display cumulative energy dispensed across all completed sessions
* Deliver a modern and visually interesting design inspired by the provided reference image

## MVP Scope

The initial MVP should focus on a single fully implemented tab:

* Dashboard tab: full charging-station simulation experience

Other tabs should be present, navigable, and functional as placeholders only:

* Cars tab: placeholder content for future stage
* Stations tab: placeholder content for future stage
* Simulation tab: placeholder content for future stage
* Settings tab: placeholder content for future stage

Placeholder tabs should show clear text that the feature is planned for a future stage.

## Non-Goals

* Payment processing or billing workflows
* Real vehicle telematics integration
* User authentication or multi-user accounts
* Hardware control of physical chargers
* Historical persistence beyond the current browser session

## Users and Personas

| Persona | Needs | Success Looks Like |
| --- | --- | --- |
| Demo viewer | Visually engaging simulation with clear feedback | Can click a passing car, watch charge progress, and observe completed cycle |
| Workshop participant | Understandable interactive architecture to extend | Can modify animation, charging rules, or visual style without major refactor |
| Facilitator | Reliable demo flow for presentations | Can run the app and demonstrate repeated charging cycles with stable behavior |

## Core User Journey

### Journey 1: Select and Charge a Car

* Actor: user
* Trigger: user clicks a moving car on the bottom roadway
* Preconditions: simulator is running and at least one charging slot is available
* Main flow:
  1. User clicks a moving car in traffic.
  2. Selected car exits roadway path and navigates to an open charging slot.
  3. Charging session starts automatically.
  4. Battery level visibly increases over time.
  5. Session completes around 60 seconds.
  6. Car leaves the charging bay and rejoins roadway traffic.
* Alternate flow:
  * If no slot is available, the car is ignored or queued according to configured behavior, and UI communicates status.
* Outcome: completed charging cycle with updated battery state and aggregate energy counter.

### Journey 2: Observe Fleet Throughput

* Actor: user
* Trigger: dashboard remains open while cars cycle through charging sessions
* Preconditions: simulator is running
* Main flow:
  1. User monitors active charging bays and roadway traffic.
  2. User watches total energy dispensed counter increment when sessions complete.
  3. User observes multiple cycles over time.
* Outcome: user can quickly understand simulator throughput and charging activity.

## Functional Requirements

| ID | Requirement | Priority | Notes |
| --- | --- | --- | --- |
| FR-001 | The page shall render a dedicated charging station area in the upper portion of the viewport. | Must | Includes multiple charging slots and status panels |
| FR-002 | The page shall render a roadway in the lower portion of the viewport with continuously moving cars. | Must | Cars are generated at regular intervals and move slowly left-to-right or right-to-left based on lane rules |
| FR-002A | Car generation interval and roadway movement speed shall be configurable constants. | Should | Enables assignment tuning without logic rewrites |
| FR-003 | Users shall be able to click a moving roadway car to request charging. | Must | Pointer and keyboard interaction supported |
| FR-004 | On selection, the car shall animate from roadway to an available charging slot. | Must | Visual path should be smooth and obvious |
| FR-005 | The simulator shall start charging automatically when the car reaches the slot. | Must | Charging session enters active state |
| FR-006 | The UI shall show battery percentage for charging vehicles and animate incrementing charge level. | Must | Numeric and visual fill indicator |
| FR-007 | A charging session shall complete in approximately 60 seconds by default. | Must | Configurable duration for testing |
| FR-008 | On completion, the charged car shall animate from slot back to roadway traffic. | Must | Reentry should not overlap with active bay occupancy |
| FR-009 | The simulator shall compute and display total energy dispensed across all completed sessions. | Must | Counter should be persistent during page session |
| FR-010 | The total energy counter shall update immediately after each session completes. | Must | Unit displayed in kWh |
| FR-011 | If all slots are occupied, selection behavior shall follow a defined policy. | Should | Default policy: ignore click and show non-blocking status |
| FR-012 | The UI shall display active slot status including car identity, current battery percentage, and estimated time remaining. | Should | Improves observability |
| FR-013 | Users shall be able to reset the simulation state from the UI. | Should | Resets counters, slots, and active traffic state |
| FR-014 | The application shall support responsive layouts for desktop and mobile. | Must | No clipped critical controls or unreadable data |
| FR-015 | The application shall provide tabs for Dashboard, Cars, Stations, Simulation, and Settings. | Must | Dashboard is initial MVP focus |
| FR-016 | The Dashboard tab shall contain the full MVP charging simulation experience. | Must | Includes roadway motion, click-to-charge, battery progression, and total energy counter |
| FR-017 | Cars, Stations, Simulation, and Settings tabs shall be functional placeholders in MVP. | Must | Each tab must render placeholder text indicating future-stage implementation |

## Non-Functional Requirements

| ID | Category | Requirement | Target |
| --- | --- | --- | --- |
| NFR-001 | Performance | Animations should run smoothly on modern desktop browsers. | ~60 FPS target, graceful degradation on slower devices |
| NFR-002 | Responsiveness | Initial interactive load should be fast for local workshop demos. | First render under 2 seconds on local dev machine |
| NFR-003 | Reliability | Session state transitions must be deterministic and recoverable on reset. | No stuck vehicles or orphaned slots after reset |
| NFR-004 | Accessibility | Interactive vehicles and controls must be keyboard accessible and screen-reader labeled. | Meets WCAG AA intent for core flows |
| NFR-005 | Maintainability | Simulation logic and rendering logic should be separated into clear modules. | Facilitates workshop extensions |

## User Experience Requirements

* The visual hierarchy should prioritize station state and cumulative metrics.
* Motion should be meaningful, including roadway loop movement, bay entry, charging progression, and bay exit.
* Color and typography should create a modern, energetic look without harming readability.
* Battery indicators should use clear visual states (low, medium, high) and textual percentages.
* System feedback for unavailable slots should be noticeable but non-intrusive.

## Data Model Requirements

The simulator should maintain in-memory entities similar to:

* Vehicle:
  * id
  * style or type
  * spawnedAt
  * batteryStartPercent
  * batteryCurrentPercent
  * batteryTargetPercent
  * estimatedCapacityKWh
  * roadwaySpeed
  * state (roadway, entering, charging, exiting)
* ChargingSlot:
  * id
  * occupiedByVehicleId
  * chargingPowerKw
  * sessionStartTime
  * expectedEndTime
* Session:
  * sessionId
  * vehicleId
  * slotId
  * startedAt
  * completedAt
  * energyDispensedKWh
* SimulationMetrics:
  * totalEnergyDispensedKWh
  * completedSessionCount
  * activeSessionCount

## Technical Approach

Implement as a client-first web application that keeps simulation state in browser memory.

### Suggested Architecture

* Rendering and animation layer for roadway, station, and vehicle movement
* State engine for vehicle lifecycle transitions and timing
* Charging computation module for battery and kWh progression
* Metrics module for cumulative totals and derived dashboard values
* Optional local API shim only if workshop scenarios require externalized state

### Key State Transitions

```text
ROADWAY
  -> (click vehicle)
ENTERING_SLOT
  -> (vehicle reaches slot)
CHARGING
  -> (session duration reached or battery target met)
EXITING_SLOT
  -> (vehicle reaches roadway)
ROADWAY
```

## Acceptance Criteria

* AC-001: Given the page is loaded, when the simulator starts, then cars are created at regular intervals and move slowly across the lower roadway.
* AC-002: Given a moving roadway car and an available slot, when the user clicks that car, then the car animates into a charging slot.
* AC-003: Given a car is in a charging slot, when charging is active, then battery percentage increases over time.
* AC-004: Given a charging session reaches its completion condition, when session ends, then the car exits the slot and rejoins roadway traffic.
* AC-005: Given one or more completed sessions, when each session completes, then the total energy dispensed counter increments by that session energy.
* AC-006: Given all slots are occupied, when the user clicks a roadway car, then the UI follows the defined full-capacity behavior and communicates status.
* AC-007: Given a mobile viewport, when the page is rendered, then critical charging and energy metrics remain visible and readable.
* AC-008: Given the user opens Cars, Stations, Simulation, or Settings in the MVP, when the tab loads, then placeholder text is shown indicating that feature is planned for a future stage.
* AC-009: Given the user opens Dashboard in the MVP, when the tab loads, then the full charging simulation is available.

## Testing Strategy

* Unit tests:
  * Vehicle state transition rules
  * Charging progression math
  * Energy accumulation logic
* Integration tests:
  * Click-to-slot assignment workflow
  * Full session lifecycle (enter, charge, exit, metric update)
* Manual validation:
  1. Start the app.
  2. Click at least three roadway vehicles across different times.
  3. Confirm each selected vehicle enters a slot and charges.
  4. Confirm completed vehicles rejoin traffic.
  5. Confirm total energy counter increases after each completed session.

## Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
| --- | --- | --- | --- |
| Animation overlap causes visual confusion | Medium | Medium | Use explicit z-index layers and collision-safe movement paths |
| State desynchronization between animation and logic | High | Medium | Drive animation from single source of truth state machine |
| Performance drops on low-end devices | Medium | Medium | Cap active animated entities and simplify effects on smaller screens |

## Open Questions

* Should cars queue when slots are full, or should clicks be rejected while full?
* Should charging duration be fixed for all vehicles or based on battery delta and power?
* Should total energy dispensed persist across page refresh using local storage?
