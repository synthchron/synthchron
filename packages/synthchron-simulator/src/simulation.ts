import seedrandom from 'seedrandom'

import { ProcessModel } from './types/processModelTypes'
import {
  Configuration,
  ProcessEngine,
  SimulationResult,
  TerminationStatus,
  Trace,
} from './types/simulationTypes'

//const PROCESS_ENGINES = [petriNetEngine]

/* export const simulate = <
  SpecificProcessModel extends ProcessModel,
  StateType,
  ActivityIdentifier
>(
  processModel: SpecificProcessModel,
  configuration: Configuration
): SimulationResult => {
  // TODO: This currently finds the process engine to use. If we want to make this more flexible, we can add a processEngine field to be specified instead.
  const processEngine = PROCESS_ENGINES.find(
    (engine) => engine.processModelType === processModel.type
  )

  if (processEngine === undefined)
    throw new Error(
      `No process engine found for process model type ${processModel.type}`
    )

  return simulateWithEngine(
    processModel,
    configuration,
    processEngine as ProcessEngine<
      SpecificProcessModel,
      StateType,
      ActivityIdentifier
    >
  )
}
 */
export const simulateWithEngine = <
  SpecificProcessModel extends ProcessModel,
  StateType,
  ActivityIdentifier extends string
>(
  processModel: SpecificProcessModel,
  configuration: Configuration,
  processEngine: ProcessEngine<
    SpecificProcessModel,
    StateType,
    ActivityIdentifier
  >
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
    const [activity, activityName] = weightedRandom(
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

const weightedRandom = <T>(
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

const checkTermination = <
  SpecificProcessModel extends ProcessModel,
  StateType,
  ActivityIdentifier
>(
  processModel: SpecificProcessModel,
  configuration: Configuration,
  state: StateType,
  processEngine: ProcessEngine<
    SpecificProcessModel,
    StateType,
    ActivityIdentifier
  >,
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
