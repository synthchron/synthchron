import seedrandom from 'seedrandom'

import { Configuration, Trace } from '@synthchron/simulator'
import { weightedRandom } from '@synthchron/simulator/dist/src'

import {
  PostProcessingConfiguration,
  PostProcessingStepType,
  SimpleSteps,
} from './types'

export const postprocess = (
  traces: Trace[],
  postProcessingConfiguration: PostProcessingConfiguration,
  config: Configuration
): Trace[] => {
  const postProcessingSteps: Set<[SimpleSteps, number]> = new Set()
  for (const postProcessingStep of postProcessingConfiguration.postProcessingSteps) {
    postProcessingSteps.add([postProcessingStep, postProcessingStep.weight])
  }

  const randomGenerator = seedrandom(config.randomSeed)
  traces.forEach((trace) => {
    // using for loop, to get the correct index to identify the event
    for (let i = 0; i < trace.events.length; i++) {
      const random = randomGenerator()
      if (random < postProcessingConfiguration.stepProbability) {
        const postProcessingStep = weightedRandom(
          postProcessingSteps,
          randomGenerator
        )

        switch (postProcessingStep.type) {
          case PostProcessingStepType.DeletionStep:
            trace = performDeletion(trace, i)
            i = i - 1
            break
          case PostProcessingStepType.SwapStep:
            trace = performSwap(trace, i)
            i = i + 1
            break
          case PostProcessingStepType.InsertionStep:
            trace = performInsertion(trace, i)
            i = i + 1
            break
        }
      }
    }
  })

  return traces
}

const performDeletion = (trace: Trace, event_id: number): Trace => {
  trace.events.splice(event_id, 1)
  return trace
}

const performSwap = (trace: Trace, _event_id: number): Trace => {
  return trace
}

const performInsertion = (trace: Trace, _event_id: number): Trace => {
  return trace
}
