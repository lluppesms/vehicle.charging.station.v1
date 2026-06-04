import { type CSSProperties, useEffect, useMemo, useReducer, useState } from 'react'
import './App.css'

const tabs = ['Dashboard', 'Cars', 'Stations', 'Simulation', 'Settings'] as const
type Tab = (typeof tabs)[number]

interface RoadCar {
  id: number
  label: string
  battery: number
  lane: number
  laneOffset: number
  driveDuration: number
  kind: 'car' | 'truck'
  bodyColor: string
  accentColor: string
}

interface ChargingSlot {
  id: number
  vehicle?: RoadCar
  progress: number
}

interface SimulationState {
  roadCars: RoadCar[]
  queuedCars: RoadCar[]
  slots: ChargingSlot[]
  totalEnergyKwh: number
  completedSessions: number
  statusMessage: string
  nextVehicleId: number
}

type SimulationAction = { type: 'tick' } | { type: 'select-road-car'; car: RoadCar }

const slotCount = 3
const laneCount = 3
const estimatedCapacityKwh = 72
const vehiclePalette = [
  { bodyColor: '#4fc3ff', accentColor: '#daf3ff' },
  { bodyColor: '#ff5b74', accentColor: '#ffdbe2' },
  { bodyColor: '#5ce39b', accentColor: '#dcffec' },
  { bodyColor: '#ffd166', accentColor: '#fff0c8' },
  { bodyColor: '#c58bff', accentColor: '#f0dfff' },
  { bodyColor: '#ff8d4f', accentColor: '#ffe2d2' },
]

function createRoadCar(
  id: number,
  minBattery: number,
  batteryVariance: number,
  lane: number,
  staggerSeconds: number,
): RoadCar {
  const palette = vehiclePalette[Math.floor(Math.random() * vehiclePalette.length)]
  return {
    id,
    label: `EV-${id.toString().padStart(2, '0')}`,
    battery: Math.floor(minBattery + Math.random() * batteryVariance),
    lane,
    laneOffset: staggerSeconds + Math.random() * 1.4,
    driveDuration: 16 + lane * 0.8 + Math.random() * 3.2,
    kind: Math.random() > 0.66 ? 'truck' : 'car',
    bodyColor: palette.bodyColor,
    accentColor: palette.accentColor,
  }
}

function createRoadCars(startAt = 1, count = 9): RoadCar[] {
  return Array.from({ length: count }, (_, index) => {
    const lane = index % laneCount
    const staggerSeconds = Math.floor(index / laneCount) * 2.3
    return createRoadCar(startAt + index, 18, 52, lane, staggerSeconds)
  })
}

function getVehicleStyle(vehicle: RoadCar): CSSProperties {
  return {
    '--vehicle-body': vehicle.bodyColor,
    '--vehicle-accent': vehicle.accentColor,
  } as CSSProperties
}

function getTrafficVehicleStyle(vehicle: RoadCar): CSSProperties {
  return {
    '--lane-index': vehicle.lane,
    '--drive-duration': `${vehicle.driveDuration}s`,
    animationDelay: `-${vehicle.laneOffset}s`,
  } as CSSProperties
}

function createInitialSimulationState(): SimulationState {
  const initialRoadCars = createRoadCars()
  return {
    roadCars: initialRoadCars,
    queuedCars: [],
    slots: Array.from({ length: slotCount }, (_, idx) => ({
      id: idx + 1,
      vehicle: undefined,
      progress: 0,
    })),
    totalEnergyKwh: 0,
    completedSessions: 0,
    statusMessage: 'Simulator online. Click a roadway car to assign a charging bay.',
    nextVehicleId: initialRoadCars.length + 1,
  }
}

function simulationReducer(state: SimulationState, action: SimulationAction): SimulationState {
  if (action.type === 'select-road-car') {
    const selectedCar = action.car
    if (!state.roadCars.some((car) => car.id === selectedCar.id)) {
      return state
    }

    const availableSlot = state.slots.findIndex((slot) => !slot.vehicle)
    if (availableSlot === -1) {
      return {
        ...state,
        roadCars: state.roadCars.filter((car) => car.id !== selectedCar.id),
        queuedCars: state.queuedCars.some((queuedCar) => queuedCar.id === selectedCar.id)
          ? state.queuedCars
          : [...state.queuedCars, selectedCar],
        statusMessage:
          `${selectedCar.label} added to holding queue. All charging bays are currently occupied.`,
      }
    }

    return {
      ...state,
      roadCars: state.roadCars.filter((car) => car.id !== selectedCar.id),
      slots: state.slots.map((slot, index) =>
        index === availableSlot
          ? { ...slot, vehicle: selectedCar, progress: selectedCar.battery }
          : slot,
      ),
      statusMessage: `${selectedCar.label} assigned to Bay ${state.slots[availableSlot].id}. Charging started.`,
    }
  }

  let completedNow = 0
  let dispensedNow = 0
  let nextVehicleId = state.nextVehicleId
  const returningCars: RoadCar[] = []

  const progressedSlots = state.slots.map((slot) => {
    if (!slot.vehicle) {
      return slot
    }

    const nextProgress = Math.min(100, slot.progress + 2)
    if (nextProgress >= 100) {
      completedNow += 1
      dispensedNow += ((100 - slot.vehicle.battery) / 100) * estimatedCapacityKwh
      returningCars.push(
        createRoadCar(
          nextVehicleId,
          24,
          44,
          (nextVehicleId - 1) % laneCount,
          ((nextVehicleId - 1) % 6) * 2.2,
        ),
      )
      nextVehicleId += 1
      return { ...slot, vehicle: undefined, progress: 0 }
    }

    return { ...slot, progress: nextProgress }
  })

  const openSlotIndexes = progressedSlots
    .map((slot, index) => (slot.vehicle ? -1 : index))
    .filter((index) => index >= 0)

  // Safeguard: dequeue and assignment both derive from this same tick snapshot to prevent cross-tick over-removal.
  const assignedQueuedCars = state.queuedCars.slice(0, openSlotIndexes.length)
  const remainingQueue = state.queuedCars.slice(assignedQueuedCars.length)
  let assignedIndex = 0

  const updatedSlots = progressedSlots.map((slot) => {
    if (slot.vehicle || assignedIndex >= assignedQueuedCars.length) {
      return slot
    }

    const queuedVehicle = assignedQueuedCars[assignedIndex]
    assignedIndex += 1
    return { ...slot, vehicle: queuedVehicle, progress: queuedVehicle.battery }
  })

  const assignedFromQueueNow = assignedIndex
  let nextStatusMessage = state.statusMessage

  if (completedNow > 0 && assignedFromQueueNow > 0) {
    nextStatusMessage =
      `${completedNow} session${completedNow > 1 ? 's' : ''} completed, ${assignedFromQueueNow} queued vehicle${assignedFromQueueNow > 1 ? 's' : ''} moved to open bays.`
  } else if (assignedFromQueueNow > 0) {
    const queuedLabels = assignedQueuedCars
      .slice(0, 2)
      .map((vehicle) => vehicle.label)
      .join(', ')
    nextStatusMessage =
      `${queuedLabels}${assignedFromQueueNow > 2 ? ` +${assignedFromQueueNow - 2} more` : ''} moved from holding queue to open bay${assignedFromQueueNow > 1 ? 's' : ''}.`
  } else if (completedNow > 0) {
    nextStatusMessage =
      `${completedNow} charging session${completedNow > 1 ? 's' : ''} completed. Vehicles returned to roadway traffic.`
  }

  return {
    ...state,
    roadCars: completedNow > 0 ? [...state.roadCars, ...returningCars] : state.roadCars,
    queuedCars: remainingQueue,
    slots: updatedSlots,
    totalEnergyKwh: state.totalEnergyKwh + dispensedNow,
    completedSessions: state.completedSessions + completedNow,
    statusMessage: nextStatusMessage,
    nextVehicleId,
  }
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard')
  const [simulation, dispatchSimulation] = useReducer(
    simulationReducer,
    undefined,
    createInitialSimulationState,
  )

  useEffect(() => {
    const timer = setInterval(() => {
      dispatchSimulation({ type: 'tick' })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const activeSessions = useMemo(
    () => simulation.slots.filter((slot) => Boolean(slot.vehicle)).length,
    [simulation.slots],
  )

  const handleRoadCarSelection = (car: RoadCar) => {
    dispatchSimulation({ type: 'select-road-car', car })
  }

  const placeholderContent: Record<Exclude<Tab, 'Dashboard'>, string> = {
    Cars: 'Cars management and fleet controls are planned for the next stage.',
    Stations:
      'Station configuration workflows are planned for the next stage.',
    Simulation:
      'Simulation tuning controls are planned for the next stage.',
    Settings: 'Application settings are planned for the next stage.',
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1>Vehicle Charging Station Simulator</h1>
        <p>Dashboard-first MVP shell with live charging bay activity and roadway intake.</p>
      </header>

      <nav className="tab-nav" aria-label="Primary tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={tab === activeTab ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(tab)}
            aria-current={tab === activeTab ? 'page' : undefined}
          >
            {tab}
          </button>
        ))}
      </nav>

      {activeTab === 'Dashboard' ? (
        <section className="dashboard" aria-label="Dashboard">
          <div className="metrics">
            <article className="metric-card">
              <h2>Total Energy Dispensed</h2>
              <p className="metric-value">{simulation.totalEnergyKwh.toFixed(1)} kWh</p>
            </article>
            <article className="metric-card">
              <h2>Active Sessions</h2>
              <p className="metric-value">{activeSessions}</p>
            </article>
            <article className="metric-card">
              <h2>Completed Sessions</h2>
              <p className="metric-value">{simulation.completedSessions}</p>
            </article>
            <article className="metric-card">
              <h2>Queue Length</h2>
              <p className="metric-value">{simulation.queuedCars.length}</p>
            </article>
          </div>

          <p className="status" role="status">
            {simulation.statusMessage}
          </p>

          <section className="queue-panel" aria-label="Holding queue">
            <h2>Holding Queue</h2>
            <p className="queue-summary">
              {simulation.queuedCars.length === 0
                ? 'Queue clear. Vehicles can dock immediately when selected.'
                : `${simulation.queuedCars.length} vehicle${simulation.queuedCars.length > 1 ? 's' : ''} waiting for the next open bay.`}
            </p>
            {simulation.queuedCars.length > 0 ? (
              <ul className="queue-list">
                {simulation.queuedCars.slice(0, 4).map((queuedCar) => (
                  <li key={queuedCar.id}>
                    {queuedCar.label} ({queuedCar.battery}% battery)
                  </li>
                ))}
                {simulation.queuedCars.length > 4 ? (
                  <li>+{simulation.queuedCars.length - 4} more waiting</li>
                ) : null}
              </ul>
            ) : null}
          </section>

          <section className="station" aria-label="Charging station bays">
            {simulation.slots.map((slot) => (
              <article key={slot.id} className="bay">
                <h3>Bay {slot.id}</h3>
                {slot.vehicle ? (
                  <>
                    <div className="bay-scene" aria-hidden="true">
                      <div className="bay-glow" />
                      <div className="charger" />
                      <span
                        className={`vehicle parked vehicle-${slot.vehicle.kind}`}
                        style={getVehicleStyle(slot.vehicle)}
                      >
                        <span className="vehicle-cabin" />
                        <span className="vehicle-wheel vehicle-wheel-front" />
                        <span className="vehicle-wheel vehicle-wheel-rear" />
                      </span>
                    </div>
                    <p className="bay-readout">{slot.vehicle.label} charging</p>
                    <div
                      className="battery-track"
                      role="progressbar"
                      aria-label={`${slot.vehicle.label} battery`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(slot.progress)}
                    >
                      <div
                        className="battery-fill"
                        style={{ width: `${slot.progress}%` }}
                      />
                    </div>
                    <p>{Math.round(slot.progress)}% charged</p>
                  </>
                ) : (
                  <p className="idle">Awaiting vehicle assignment.</p>
                )}
              </article>
            ))}
          </section>

          <section className="roadway" aria-label="Roadway traffic">
            <h2>Roadway Traffic</h2>
            <p>Click a moving car to send it to a charging bay or queue when all bays are full.</p>
            <div className="lane">
              {simulation.roadCars.map((car) => (
                <button
                  key={car.id}
                  type="button"
                  className={`traffic-vehicle ${car.kind}`}
                  style={getTrafficVehicleStyle(car)}
                  onClick={() => handleRoadCarSelection(car)}
                  aria-label={`Send ${car.label} (${car.battery}% battery) to a charging bay`}
                >
                  <span
                    className={`vehicle vehicle-${car.kind}`}
                    style={getVehicleStyle(car)}
                    aria-hidden="true"
                  >
                    <span className="vehicle-cabin" />
                    <span className="vehicle-wheel vehicle-wheel-front" />
                    <span className="vehicle-wheel vehicle-wheel-rear" />
                  </span>
                  <span className="car-readout">
                    <span>{car.label}</span>
                    <span>{car.battery}%</span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </section>
      ) : (
        <section className="placeholder" aria-label={`${activeTab} placeholder`}>
          <h2>{activeTab}</h2>
          <p>{placeholderContent[activeTab]}</p>
        </section>
      )}
    </main>
  )
}

export default App
