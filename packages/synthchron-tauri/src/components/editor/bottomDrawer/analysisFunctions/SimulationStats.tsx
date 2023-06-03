import { PetriNetProcessModel } from '@synthchron/simulator/src/types/processModelTypes/petriNetTypes'
import { SimulationLog } from '@synthchron/simulator/src/types/simulationTypes'
import { XESLog } from '@synthchron/xes'

import { transformSimulationLogToXESLog } from '../../../../utils/simulatorToXESConverter'
import { ResultType } from '../../editorStore/simulatorSlice'

//Polymorphic funtion to count repetetions of entires in array, and sort them.
const SumMapSort = (list: unknown[]): [unknown, number][] => {
  const resultMap = list.reduce((map: Map<unknown, number>, value) => {
    map.set(value, (map.get(value) || 0) + 1)
    return map
  }, new Map<unknown, number>())

  return Array.from(resultMap).sort()
}

//Translate simulation log to ResultType, and add statistics
export const SimulationStatisticsAdapter = (
  simulationLog: SimulationLog,
  processModel: PetriNetProcessModel
): ResultType => {
  const xeslog = transformSimulationLogToXESLog(simulationLog)
  const basicStats = GetBasicStats(xeslog)
  const lastTransitionStats = GetLastTransitions(xeslog)
  const terminationStats = GetTerminationStats(simulationLog)
  const coverageStats = GetCoverage(xeslog, processModel)

  const result: ResultType = {
    log: xeslog,
    statistics: {
      ...basicStats,
      ...coverageStats,
      ...lastTransitionStats,
      ...terminationStats,
    },
    simulationLog: simulationLog,
  }

  return result
}

const GetBasicStats = (xeslog: XESLog) => {
  const totalTraces = xeslog.traces.length

  const totalEvents = xeslog.traces.reduce((accumulator, trace) => {
    return accumulator + trace.events.length
  }, 0)
  const averageEvents = totalEvents / totalTraces

  const basicStats = {
    'Number of traces': totalTraces,
    'Number of events': totalEvents,
    'Average events': averageEvents,
  }

  return basicStats
}

const GetLastTransitions = (xeslog: XESLog) => {
  const lastTransitions: string[] = xeslog.traces
    .map((trace) => {
      const lastEvent = trace.events[trace.events.length - 1]
      const lastAttribute =
        lastEvent?.attributes[lastEvent.attributes.length - 1]
      return lastAttribute?.value
    })
    .filter((xesEvent): xesEvent is string => xesEvent !== undefined)

  const transitionByFreq = SumMapSort(lastTransitions)

  const top3Transitions: string[] = transitionByFreq
    .slice(0, 3)
    .map(([transition, number]) => `${transition} (${number || 0})`)

  const lastTransitionStats = {
    'Most common last event': top3Transitions[0],
    'Second most common last event': top3Transitions[1],
    'Third most common last event': top3Transitions[2],
  }

  return lastTransitionStats
}

const GetTerminationStats = (simulationLog: SimulationLog) => {
  const terminationReasons = simulationLog.simulationResults.map(
    (trace) => trace.exitReason
  )
  const summedTerminationReasons = SumMapSort(terminationReasons)

  const top3Terminations: string[] = summedTerminationReasons
    .slice(0, 3)
    .map(([reason, number]) => `${reason} (${number || 0})`)

  const terminationStats = {
    'Most common exit reason': top3Terminations[0],
    'Second most common exit reason': top3Terminations[1],
    'Third most common exit reason': top3Terminations[2],
  }
  return terminationStats
}

const GetCoverage = (xeslog: XESLog, processModel: PetriNetProcessModel) => {
  // event.attributes[0].value is used to identify unique transitions, however
  // if attributes change to make use of their array or .key this may need to be changed.

  //Transition labels may not be unique, so counting transitions would give the wrong number.
  const uniqueTransitions = processModel.nodes.reduce((set, node) => {
    if (node.type === 'transition') {
      set.add(node.name)
    }
    return set
  }, new Set<string>())

  const uniqueEvents = new Set<string>()
  xeslog.traces.forEach((trace) =>
    trace.events.forEach((event) => uniqueEvents.add(event.attributes[0].value))
  )

  const uniquePerTrace = xeslog.traces.map((trace) =>
    trace.events.reduce((set, event) => {
      set.add(event.attributes[0].value)
      return set
    }, new Set<string>())
  )

  const totalUniqueEventsInTraces = uniquePerTrace.reduce(
    (accumulator, traceSet) => accumulator + traceSet.size,
    0
  )

  const coverageStats = {
    Coverage:
      ((uniqueEvents.size / uniqueTransitions.size) * 100).toFixed(2) + '%',
    'Average coverage (per trace)':
      (
        (totalUniqueEventsInTraces /
          (uniqueTransitions.size * xeslog.traces.length)) *
        100
      ).toFixed(2) + '%',
  }

  return coverageStats
}
