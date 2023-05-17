// Configuration Types for the simulation
export type Configuration = {
  configurationName?: string
  endOnAcceptingStateProbability: number
  minEvents?: number
  maxEvents?: number
  randomSeed: string
  uniqueTraces?: boolean
  maximumTraces?: number
  terminationType:
    | StandardConfigurationTerminationType
    | CoverageTerminationType
    | SpecifiedAmountOfTracesTerminationType
}

export enum TerminationType {
  Standard = 'standard',
  Coverage = 'coverage',
  SpecifiedAmountOfTraces = 'specifiedAmountOfTraces',
}

export type StandardConfigurationTerminationType = {
  type: TerminationType.Standard
}

export type CoverageTerminationType = {
  type: TerminationType.Coverage
  coverage: number
}

export type SpecifiedAmountOfTracesTerminationType = {
  type: TerminationType.SpecifiedAmountOfTraces
  amountOfTraces: number
}

// Process Engine Types

export type Weight = number
// export type ActivityIdentifier = string

export type AcceptingReason =
  | {
      isAccepting: false
    }
  | {
      isAccepting: true
      reason: string
    }

export type IsAcceptingType<ProcessModel, StateType> = (
  model: ProcessModel,
  state: StateType
) => AcceptingReason

export type GetEnabledType<ProcessModel, StateType> = (
  model: ProcessModel,
  state: StateType
) => Set<[string, Weight]>

export type ExecuteActivityType<ProcessModel, StateType> = (
  model: ProcessModel,
  state: StateType,
  activity: string
) => StateType

export type ResetActivityType<ProcessModel, StateType> = (
  model: ProcessModel
) => StateType

export type ProcessEngine<ProcessModel, StateType> = {
  processModelType: string
  isAccepting: IsAcceptingType<ProcessModel, StateType>
  getEnabled: GetEnabledType<ProcessModel, StateType>
  executeActivity: ExecuteActivityType<ProcessModel, StateType>
  resetActivity: ResetActivityType<ProcessModel, StateType>
}

// Generation Result Types

export type Trace = {
  events: Event[]
}

export type Event = {
  name?: string
  meta: object
}

export type SimulationResult = {
  trace: Trace
  exitReason: TerminationReason
  acceptingState?: string
}

type HasNotTerminatedType = {
  termination: false
}

type HasTerminatedType = {
  termination: true
  reason: TerminationReason
  acceptingState?: string
}

type TerminationReason =
  | 'maxStepsReached'
  | 'acceptingStateReached'
  | 'error'
  | 'noEnabledActivities'
export type TerminationStatus = HasNotTerminatedType | HasTerminatedType
