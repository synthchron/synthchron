import {
  Event,
  SimulationLog,
  TraceSimulationResult,
} from '@synthchron/simulator'
import { XESEvent, XESLog, XESTrace } from '@synthchron/xes'

export const transformXESLogToSimulationLog = (
  xesLog: XESLog
): SimulationLog => {
  const traces: TraceSimulationResult[] = xesLog.traces.map(
    transformXESTraceToTraceSimulationResult
  )
  return {
    simulationResults: traces,
  }
}

const transformXESTraceToTraceSimulationResult = (
  xesTrace: XESTrace
): TraceSimulationResult => {
  const events: Event[] = xesTrace.events.map(transformXESEventToEvent)
  return {
    trace: { events: events },
    // Todo: verify if I can make it nullable and assign null
    exitReason: undefined,
    acceptingState: undefined,
  }
}

const transformXESEventToEvent = (xesEvent: XESEvent): Event => {
  const event: Event = {
    name: xesEvent.attributes[0].value,
    meta: {},
  }
  return event
}
