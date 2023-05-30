import seedrandom from 'seedrandom'

import { Trace } from '@synthchron/simulator'
import { Configuration, PostprocessingStepType } from '@synthchron/types'

export const postprocess = (
  traces: Trace[],
  config: Configuration
): Trace[] => {
  const postProcessingConfiguration = config.postprocessing
  const postProcessingSteps = postProcessingConfiguration.postProcessingSteps
  const randomGenerator = seedrandom(config.randomSeed)
  traces.forEach((trace) => {
    // using for loop, to get the correct index to identify the event
    for (let i = 0; i < trace.events.length; i++) {
      const random = randomGenerator()
      if (random < postProcessingConfiguration.stepProbability) {
        const postProcessingStep = weightedRandom<PostprocessingStepType>(
          (i != 0
            ? postProcessingSteps
            : postProcessingSteps.filter(
                (step) => step.type !== PostprocessingStepType.SwapStep
              )
          ).map((step) => [step.type, step.weight]),
          randomGenerator
        )

        switch (postProcessingStep) {
          case PostprocessingStepType.DeletionStep:
            trace = performDeletion(trace, i)
            i -= 1
            break
          case PostprocessingStepType.SwapStep:
            trace = performSwap(trace, i)
            i += 1
            break
          case PostprocessingStepType.InsertionStep:
            trace = performInsertion(trace, i)
            i += 1
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

const performSwap = (trace: Trace, event_id: number): Trace => {
  const temp = trace.events[event_id]
  trace.events[event_id] = trace.events[event_id - 1]
  trace.events[event_id - 1] = temp
  return trace
}

const performInsertion = (trace: Trace, _event_id: number): Trace => {
  return trace
}

export const weightedRandom = <T>(
  activities: Iterable<[T, number]>,
  randomGenerator: seedrandom.PRNG
): T | undefined => {
  const cumulativeWeights: [T, number][] = []
  let cumulativeWeight = 0
  for (const [activity, weight] of activities) {
    cumulativeWeight += weight
    cumulativeWeights.push([activity, cumulativeWeight])
  }
  if (cumulativeWeights.length === 0) return undefined
  const random = randomGenerator() * cumulativeWeight
  for (const [activity, cumulativeWeight] of cumulativeWeights) {
    if (random <= cumulativeWeight) return activity
  }
  throw new Error('Weighted random failed')
}
