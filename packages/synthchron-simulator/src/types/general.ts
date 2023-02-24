// Configuration Types for the simulation
export type Configuration = {
    // TODO: Add configuration options here   
    endOnAcceptingState?: boolean,
    minEvents?: number,
    maxEvents?: number,
}

// Process Engine Types

export type Weight = number
// export type ActivityIdentifier = string

export type IsAcceptingType<ProcessModel, StateType, ActivityIdentifier> = (model: ProcessModel, state: StateType) => boolean

export type GetEnabledType<ProcessModel, StateType, ActivityIdentifier> = (model: ProcessModel, state: StateType) => Set<[ActivityIdentifier, Weight]>

export type ExecuteActivityType<ProcessModel, StateType, ActivityIdentifier> = (model: ProcessModel, state: StateType, activity: ActivityIdentifier) => StateType

export type ResetActivityType<ProcessModel, StateType, ActivityIdentifier> = (model: ProcessModel) => StateType

export type ProcessEngine<ProcessModel, StateType, ActivityIdentifier> = {
    processModelType: string,
    isAccepting: IsAcceptingType<ProcessModel, StateType, ActivityIdentifier>,
    getEnabled: GetEnabledType<ProcessModel, StateType, ActivityIdentifier>,
    executeActivity: ExecuteActivityType<ProcessModel, StateType, ActivityIdentifier>,
    resetActivity: ResetActivityType<ProcessModel, StateType, ActivityIdentifier>
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
}

type HasNotTerminatedType = {
    termination: false,
}
type HasTerminatedType = {
    termination: true,
    reason: TerminationReason
}
type TerminationReason = 'maxStepsReached' | 'acceptingStateReached' | 'error' | 'noEnabledActivities'
export type TerminationStatus = HasNotTerminatedType | HasTerminatedType