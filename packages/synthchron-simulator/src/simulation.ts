import { petriNetEngine } from './process-engines/petrinet-engine'
import {
  Configuration,
  ProcessEngine,
  SimulationResult,
  TerminationStatus,
  Trace,
} from './types/general'
import { ProcessModel } from './types/processModel'

const PROCESS_ENGINES = [petriNetEngine]

export const simulate = (
  processModel: ProcessModel,
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

  return simulateWithEngine(processModel, configuration, petriNetEngine)
}

export const simulateWithEngine = (
  processModel: ProcessModel,
  configuration: Configuration,
  processEngine: ProcessEngine<unknown, unknown, unknown>
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

  let terminationReason = checkTermination(
    processModel,
    configuration,
    state,
    processEngine,
    trace
  )

  while (!terminationReason.termination) {
    const enabledActivities = processEngine.getEnabled(processModel, state)
    const activity = enabledActivities.keys().next().value[0] // TODO: Add random selection
    state = processEngine.executeActivity(processModel, state, activity)
    trace.events.push({
      name: activity,
      meta: {},
    })
    terminationReason = checkTermination(
      processModel,
      configuration,
      state,
      processEngine,
      trace
    )
  }

  return {
    trace,
    exitReason: terminationReason.reason,
  }
}

const checkTermination = (
  processModel: ProcessModel,
  configuration: Configuration,
  state: unknown,
  processEngine: ProcessEngine<unknown, unknown, unknown>,
  trace: Trace
): TerminationStatus => {
  // Check if the process is accepting (and the minimum number of events has been reached)
  if (
    configuration.endOnAcceptingState &&
    (configuration.minEvents === undefined ||
      configuration.minEvents <= trace.events.length) &&
    processEngine.isAccepting(processModel, state)
  )
    return {
      termination: true,
      reason: 'acceptingStateReached',
    }

  // Check if the maximum number of events has been reached
  if (
    configuration.maxEvents !== undefined &&
    trace.events.length >= configuration.maxEvents
  )
    return {
      termination: true,
      reason: 'maxStepsReached',
    }

  // Check if there are no enabled activities
  if (processEngine.getEnabled(processModel, state).size === 0)
    return {
      termination: true,
      reason: 'noEnabledActivities',
    }

  // Otherwise, continue
  return {
    termination: false,
  }
}
