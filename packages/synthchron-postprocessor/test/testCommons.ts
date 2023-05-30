import { Event, Trace } from '@synthchron/simulator'
import {
  Configuration,
  StandardConfigurationTerminationType,
} from '@synthchron/types/src/types/configuration'

export const testingConfig: Configuration = {
  endOnAcceptingStateProbability: 1,
  randomSeed: 'word',
  terminationType: {
    type: 'standard',
  } as StandardConfigurationTerminationType,
  postprocessing: {
    // These values are set within the tests
    stepProbability: 0.5,
    postProcessingSteps: [],
  },
  uniqueTraces: false,
  maximumTraces: 1,
}
const AF_Events: Event[] = [
  { name: 'a', meta: {} },
  { name: 'b', meta: {} },
  { name: 'c', meta: {} },
  { name: 'd', meta: {} },
  { name: 'e', meta: {} },
  { name: 'f', meta: {} },
]

const GL_Events: Event[] = [
  { name: 'g', meta: {} },
  { name: 'h', meta: {} },
  { name: 'i', meta: {} },
  { name: 'j', meta: {} },
  { name: 'k', meta: {} },
  { name: 'l', meta: {} },
]

const MR_Events: Event[] = [
  { name: 'm', meta: {} },
  { name: 'n', meta: {} },
  { name: 'o', meta: {} },
  { name: 'p', meta: {} },
  { name: 'q', meta: {} },
  { name: 'r', meta: {} },
]

export const singleTrace: Trace[] = [
  {
    events: AF_Events,
  },
]

export const multipleTraces: Trace[] = [
  {
    events: AF_Events,
  },
  {
    events: GL_Events,
  },
  {
    events: MR_Events,
  },
]

export const emptyTrace: Trace[] = [
  {
    events: [],
  },
]
