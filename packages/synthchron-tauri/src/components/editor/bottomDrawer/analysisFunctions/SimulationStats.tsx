import { XESLog } from '@synthchron/xes'

import { ResultType } from '../../editorStore/simulatorSlice'

//Translate simulation log to ResultType, and add statistics
export const SimulationStatisticsAdapter = (xeslog: XESLog): ResultType => {
  const totalTraces = xeslog.traces.length
  const totalEvents = xeslog.traces.reduce(
    (accumulator, trace) => accumulator + trace.events.length,
    0
  )
  const averageEvents = totalEvents / totalTraces

  const result: ResultType = {
    log: xeslog,
    statistics: {
      'Number of traces': totalTraces,
      'Number of events': totalEvents,
      'Average events': averageEvents,
    },
  }

  return result
}
