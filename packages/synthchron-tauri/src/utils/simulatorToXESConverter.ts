import { Event, SimulationResult } from '@synthchron/simulator'
import { XESEvent, XESLog } from '@synthchron/xes'

export const transformSimulatioResultToXESLog = (
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
  const attributes = Object.entries(event.meta).map(([key, value]) => {
    return {
      key,
      value: value.toString(),
    }
  })
  if (event.name !== undefined) {
    attributes.push({
      key: 'Activity',
      value: event.name,
    })
  }
  const xesEvent: XESEvent = {
    attributes,
  }
  return xesEvent
}
