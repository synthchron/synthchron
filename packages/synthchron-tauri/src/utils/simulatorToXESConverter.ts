import {
  Event,
  SimulationLog,
  TraceSimulationResult,
} from '@synthchron/simulator'
import { XESEvent, XESLog, XESTrace } from '@synthchron/xes'

const transformSimulationResultToXESLog = (
  simulationResult: TraceSimulationResult
): XESTrace => {
  const XESTrace = {
    events: simulationResult.trace.events.map(convertEventToXESEvent),
  }
  return XESTrace
}

export const transformSimulationLogToXESLog = (
  simulationLog: SimulationLog
): XESLog => {
  const XESLog = {
    traces: simulationLog.simulationResults.map(
      transformSimulationResultToXESLog
    ),
  }
  return XESLog
}

function convertEventToXESEvent(event: Event): XESEvent {
  const attributes = Object.entries(event.meta).map(([key, value]) => {
    // Does not do anything as of now (.meta is empty)
    return {
      key,
      value: value.toString(),
    }
  })

  if (event.name) {
    attributes.push({
      key: 'Activity',
      value: event.name,
    })
  }
  const xesEvent: XESEvent = {
    attributes: attributes,
  }
  console.log(xesEvent)
  return xesEvent
}
