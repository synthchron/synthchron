import seedrandom from 'seedrandom'

import { Configuration } from '@synthchron/types'
import { TerminationType } from '@synthchron/types'

import { ProcessModel } from './types/processModelTypes'
import {
  ProcessEngine,
  SimulationLog,
  TerminationStatus,
  Trace,
  TraceSimulationResult,
} from './types/simulationTypes'

const calculateCoverage = <SpecificProcessModel, StateType>(
  simulationResults: TraceSimulationResult[],
  processEngine: ProcessEngine<SpecificProcessModel, StateType>,
  processModel: SpecificProcessModel
): number => {
  const reachedTransitions = [
    ...new Set(
      simulationResults.map((result) =>
        result.trace.events.filter((event) => event.name)
      )
    ),
  ]
  if (processEngine.getActivities === undefined) {
    throw new Error('Get Activities Function not implemented in Process Engine')
  }
  const activitiesList = processEngine.getActivities(processModel)
  return reachedTransitions.length / activitiesList.length
}

const getSimulationProgress = <SpecificProcessModel, StateType>(
  processEngine: ProcessEngine<SpecificProcessModel, StateType>,
  processModel: SpecificProcessModel,
  simulationConfiguration: Configuration,
  simulationResults: TraceSimulationResult[]
): { continue: boolean; progress: number } => {
  const resultLength = simulationResults.length
  if (resultLength >= simulationConfiguration.maximumTraces)
    return { continue: false, progress: 100 }
  switch (simulationConfiguration.terminationType.type) {
    case TerminationType.Standard:
      return {
        continue: true,
        progress: (100 * resultLength) / simulationConfiguration.maximumTraces,
      }
    case TerminationType.Coverage: {
      const coverage = calculateCoverage(
        simulationResults,
        processEngine,
        processModel
      )
      if (coverage >= simulationConfiguration.terminationType.coverage) {
        return { continue: false, progress: 100 }
      }
      return {
        continue: true,
        progress:
          (100 * coverage) / simulationConfiguration.terminationType.coverage,
      }
    }
    case TerminationType.SpecifiedAmountOfTraces: {
      if (
        resultLength >= simulationConfiguration.terminationType.amountOfTraces
      ) {
        return { continue: false, progress: 100 }
      }
      return {
        continue: true,
        progress:
          (100 * resultLength) /
          simulationConfiguration.terminationType.amountOfTraces,
      }
    }
  }
}
// TODO:
// - Add support for random seed
// - Add Unique traces
export async function* simulateWithEngine<
  SpecificProcessModel extends ProcessModel,
  StateType
>(
  processModel: SpecificProcessModel,
  simulationConfiguration: Configuration,
  processEngine: ProcessEngine<SpecificProcessModel, StateType>
): AsyncGenerator<{ progress: number; simulationLog: SimulationLog }> {
  if (processEngine.processModelType !== processModel.type)
    throw new Error(
      `Process engine ${processEngine.processModelType} cannot be used with process model ${processModel.type}`
    )
  const simulationResults: TraceSimulationResult[] = []
  let status = getSimulationProgress(
    processEngine,
    processModel,
    simulationConfiguration,
    simulationResults
  )
  const randomGenerator = seedrandom(simulationConfiguration.randomSeed)
  // console.log(progress)
  while (status.continue) {
    const simulationRandomSeed = randomGenerator()
    const simResult = await simulateTraceWithEngine(
      processModel,
      {
        ...simulationConfiguration,
        randomSeed: simulationRandomSeed.toString(),
      },
      processEngine
    )
    simulationResults.push(simResult)
    status = getSimulationProgress(
      processEngine,
      processModel,
      simulationConfiguration,
      simulationResults
    )
    yield {
      progress: status.progress,
      simulationLog: { simulationResults: [] },
    }
  }
  yield { progress: 100, simulationLog: { simulationResults } }
  // return { simulationResults }
}

export const simulateTraceWithEngine = async <
  SpecificProcessModel extends ProcessModel,
  StateType
>(
  processModel: SpecificProcessModel,
  configuration: Configuration,
  processEngine: ProcessEngine<SpecificProcessModel, StateType>
): Promise<TraceSimulationResult> => {
  // Validate the used engine with the used model
  // if (processEngine.processModelType !== processModel.type)
  //   throw new Error(
  //     `Process engine ${processEngine.processModelType} cannot be used with process model ${processModel.type}`
  //   )

  const trace: Trace = {
    events: [],
  }

  let state = processEngine.resetActivity(processModel)

  const randomGenerator = seedrandom(configuration.randomSeed)

  let terminationReason = checkTermination(
    processModel,
    configuration,
    state,
    processEngine,
    trace,
    randomGenerator
  )

  while (!terminationReason.termination) {
    const enabledActivities = processEngine.getEnabled(processModel, state)
    const [activity, activityName] = weightedRandomWithName(
      enabledActivities,
      randomGenerator
    )
    state = processEngine.executeActivity(processModel, state, activity)
    trace.events.push({
      name: activityName,
      meta: {},
    })
    terminationReason = checkTermination(
      processModel,
      configuration,
      state,
      processEngine,
      trace,
      randomGenerator
    )
  }
  return {
    trace,
    exitReason: terminationReason.reason,
    acceptingState: terminationReason.acceptingState,
  }
}

export const weightedRandomWithName = <T>(
  activities: Set<[T, string, number]>,
  randomGenerator: seedrandom.PRNG
): [T, string] => {
  const cumulativeWeights: [T, string, number][] = []
  let cumulativeWeight = 0
  for (const [activity, name, weight] of activities) {
    cumulativeWeight += weight
    cumulativeWeights.push([activity, name, cumulativeWeight])
  }
  const random = randomGenerator() * cumulativeWeight
  for (const [activity, name, cumulativeWeight] of cumulativeWeights) {
    if (random <= cumulativeWeight) return [activity, name]
  }
  throw new Error('Weighted random failed')
}

const checkTermination = <SpecificProcessModel extends ProcessModel, StateType>(
  processModel: SpecificProcessModel,
  configuration: Configuration,
  state: StateType,
  processEngine: ProcessEngine<SpecificProcessModel, StateType>,
  trace: Trace,
  randomGenerator: seedrandom.PRNG
): TerminationStatus => {
  // Check if the process is accepting (and the minimum number of events has been reached)
  const acceptingState = processEngine.isAccepting(processModel, state)
  if (
    (configuration.minEvents === undefined ||
      configuration.minEvents <= trace.events.length) &&
    acceptingState.isAccepting &&
    isEndOnAcceptingState(
      configuration.endOnAcceptingStateProbability,
      randomGenerator
    )
  ) {
    return {
      termination: true,
      reason: 'acceptingStateReached',
      acceptingState: acceptingState.reason,
    }
  }

  // Check if the maximum number of events has been reached
  if (
    configuration.maxEvents !== undefined &&
    trace.events.length >= configuration.maxEvents
  ) {
    return {
      termination: true,
      reason: 'maxStepsReached',
    }
  }

  // Check if there are no enabled activities
  if (processEngine.getEnabled(processModel, state).size === 0) {
    return {
      termination: true,
      reason: 'noEnabledActivities',
    }
  }

  // Otherwise, continue
  return {
    termination: false,
  }
}

const isEndOnAcceptingState = (
  probability: number,
  randomGenerator: seedrandom.PRNG
): boolean => {
  return randomGenerator() < probability
}
