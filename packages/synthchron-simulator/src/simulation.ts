import seedrandom from 'seedrandom'

import { Configuration } from '@synthchron/types'

import { ProcessModel } from './types/processModelTypes'
import {
  ProcessEngine,
  SimulationResult,
  TerminationStatus,
  Trace,
} from './types/simulationTypes'

export const simulateWithEngine = <
  SpecificProcessModel extends ProcessModel,
  StateType
>(
  processModel: SpecificProcessModel,
  configuration: Configuration,
  processEngine: ProcessEngine<SpecificProcessModel, StateType>
): SimulationResult => {
  // Validate the used engine with the used model
  if (processEngine.processModelType !== processModel.type)
    throw new Error(
      `Process engine ${processEngine.processModelType} cannot be used with process model ${processModel.type}`
    )

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
