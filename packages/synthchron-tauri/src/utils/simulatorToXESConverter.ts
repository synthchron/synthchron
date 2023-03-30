import { Event, SimulationResult } from '@synthchron/simulator'
import { XESEvent, XESLog } from '@synthchron/xes'
import { x } from '@tauri-apps/api/path-e12e0e34'

const transformSimulatioResultToXESLog = (
  simulationResult: SimulationResult
): XESLog => {
  const XESTrace = {
    events: simulationResult.trace.events.map(convertEventToXESEvent),
  }
  const XESLog = {
    traces: [XESTrace],
  }
  return XESLog
}

function convertEventToXESEvent(event: Event): XESEvent {
  const attributes = Object.entries(event).map(([key, value]) => {
    return {
      key,
      value: value.toString(),
    }
  })
  if (event.name !== undefined) {
    attributes.push({
      key: 'concept:name',
      value: event.name,
    })
  }
  const xesEvent: XESEvent = {
    attributes,
  }
  return xesEvent
}
