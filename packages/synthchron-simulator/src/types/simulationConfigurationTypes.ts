/**
 * This file contains the types that are used to specify how a simulation should run, and its result. Specifically, it contains types for the intermediate results of a simulation, and its final result.
 */

// Type for specifying how the simulation should run
// This should represent the options a user has when starting a simulation
export type Configuration = {
  // TODO: Add configuration options here
  endOnAcceptingState?: boolean
  minEvents?: number
  maxEvents?: number
}

// Trace that is generated during a simulation
export type Trace = {
  events: Event[]
}

// A single event that is part of a trace
export type Event = {
  name?: string
  meta: object
}

// The result of a simulation, includes a trace and the reason for termination
export type SimulationResult = {
  trace: Trace
  exitReason: TerminationReason
}

// Status signifying the simulation has not terminated
type HasNotTerminatedType = {
  termination: false
}
// Status signifying the simulation has terminated
type HasTerminatedType = {
  termination: true
  reason: TerminationReason
}
// Possible reasons for termination
type TerminationReason =
  | 'maxStepsReached'
  | 'acceptingStateReached'
  | 'error'
  | 'noEnabledActivities'

// A type that represents whether a simulation has terminated or not, and if is has, the reason for termination
export type TerminationStatus = HasNotTerminatedType | HasTerminatedType
