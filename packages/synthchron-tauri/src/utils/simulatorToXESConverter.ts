import {
  Event,
  SimulationLog,
  TraceSimulationResult,
} from '@synthchron/simulator'
import { XESAttribute, XESEvent, XESLog, XESTrace } from '@synthchron/xes'

const transformSimulationResultToXESLog = (
  simulationResult: TraceSimulationResult
): XESTrace => {
  console.log('xesEvent')
  const XESTrace = {
    events: simulationResult.trace.events.map(convertEventToXESEvent),
  }
  return XESTrace
}

export const transformSimulationLogToXESLog = (
  simulationLog: SimulationLog
): XESLog => {
  console.log('r3')
  console.log(simulationLog)
  const XESLog = {
    traces: simulationLog.simulationResults.map(
      transformSimulationResultToXESLog
    ),
  }
  return XESLog
}

function convertEventToXESEvent(event: Event): XESEvent {
  const attributes: XESAttribute[] = []
  /*const attributes = Object.entries(event.meta).map(([key, value]) => {
    return {
      key,
      value: value.toString(),
    }
  })*/
  console.log('\nattributes')
  console.log(attributes)
  console.log('event')
  console.log(event)
  if (event.name) {
    const XESAttribute = {
      key: 'Activity',
      value: event.name,
    }
    console.log('XESAttribute')
    console.log(XESAttribute)
    attributes.push(XESAttribute)
  }
  console.log('attributes after')
  console.log(attributes)
  const xesEvent: XESEvent = {
    attributes: attributes,
  }
  console.log('xesEvent')
  console.log(xesEvent)
  return xesEvent
}
