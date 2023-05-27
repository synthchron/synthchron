// Process Engine Types

export type Weight = number
// export type ActivityName = string
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
) => Set<[string, string, Weight]>

export type ExecuteActivityType<ProcessModel, StateType> = (
  model: ProcessModel,
  state: StateType,
  activity: string
) => StateType

export type ResetActivityType<ProcessModel, StateType> = (
  model: ProcessModel
) => StateType

export type GetActiviesType<ProcessModel> = (model: ProcessModel) => string[]

export type ProcessEngine<ProcessModel, StateType> = {
  processModelType: string
  isAccepting: IsAcceptingType<ProcessModel, StateType>
  getEnabled: GetEnabledType<ProcessModel, StateType>
  executeActivity: ExecuteActivityType<ProcessModel, StateType>
  resetActivity: ResetActivityType<ProcessModel, StateType>
  getActivities?: GetActiviesType<ProcessModel>
}

// Generation Result Types

export type Trace = {
  events: Event[]
}

export type Event = {
  name?: string
  meta: object
}

export type TraceSimulationResult = {
  trace: Trace
  exitReason: TraceTerminationReason
  acceptingState?: string
}

export type SimulationLog = {
  simulationResults: TraceSimulationResult[]
}

type HasNotTerminatedType = {
  termination: false
}

type HasTerminatedType = {
  termination: true
  reason: TraceTerminationReason
  acceptingState?: string
}

type TraceTerminationReason =
  | 'maxStepsReached'
  | 'acceptingStateReached'
  | 'error'
  | 'noEnabledActivities'
export type TerminationStatus = HasNotTerminatedType | HasTerminatedType

export type SimulationYield = {
  progress: number
  simulationLog?: SimulationLog
}
