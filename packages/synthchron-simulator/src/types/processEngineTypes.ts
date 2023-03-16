/**
 * This file contains the types that are used to specify how a process engine should work. Specifically, it contains types for the four interface functions any process model is defined with.
 */

// Process Engine Types

export type Weight = number
// export type ActivityIdentifier = string

// isAccepting takes a model, a state, and returns true if the state is accepting
export type IsAcceptingType<ProcessModel, StateType, _ActivityIdentifier> = (
  model: ProcessModel,
  state: StateType
) => boolean

// getEnabled takes a model, a state, and returns a set of activities that can be executed in the given state
export type GetEnabledType<ProcessModel, StateType, ActivityIdentifier> = (
  model: ProcessModel,
  state: StateType
) => Set<[ActivityIdentifier, Weight]>

// executeActivity takes a model, a state, and an activity, and returns the new state after executing the activity
export type ExecuteActivityType<ProcessModel, StateType, ActivityIdentifier> = (
  model: ProcessModel,
  state: StateType,
  activity: ActivityIdentifier
) => StateType

// resetActivity takes a model, and returns its initial state
export type ResetActivityType<ProcessModel, StateType, _ActivityIdentifier> = (
  model: ProcessModel
) => StateType

// Process Engine type. A process engine is defined using a set of four functions, and their respective processModelType.
export type ProcessEngine<ProcessModel, StateType, ActivityIdentifier> = {
  processModelType: string
  isAccepting: IsAcceptingType<ProcessModel, StateType, ActivityIdentifier>
  getEnabled: GetEnabledType<ProcessModel, StateType, ActivityIdentifier>
  executeActivity: ExecuteActivityType<
    ProcessModel,
    StateType,
    ActivityIdentifier
  >
  resetActivity: ResetActivityType<ProcessModel, StateType, ActivityIdentifier>
}
