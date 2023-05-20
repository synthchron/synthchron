import { PostprocessingConfiguration } from './postprocessing'

// Configuration Types for the simulation
export type Configuration = {
  configurationName?: string
  endOnAcceptingStateProbability: number
  minEvents?: number
  maxEvents?: number
  randomSeed: string
  uniqueTraces?: boolean
  maximumTraces?: number
  terminationType: TerminationTypeUnion
  postprocessing: PostprocessingConfiguration
}

export type TerminationTypeUnion =
  | StandardConfigurationTerminationType
  | CoverageTerminationType
  | SpecifiedAmountOfTracesTerminationType

export const enum TerminationType {
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
