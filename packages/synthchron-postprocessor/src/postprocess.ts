import seedrandom from 'seedrandom'

import { SimulationLog, Trace } from '@synthchron/simulator'
import {
  Configuration,
  PostprocessingConfiguration,
  PostprocessingStepType,
} from '@synthchron/types'

import { insertDuplicate } from './insert'

export const PostprocessSimulation = (
  simulation: SimulationLog,
  config: Configuration
) => {
  const postprocessedTraces = simulation.simulationResults.map((simres) =>
    postprocess(simres.trace, config.postprocessing, config.randomSeed || '')
  )
  simulation.simulationResults.forEach(
    (value, index) => (value.trace = postprocessedTraces[index])
  )
  return simulation
}

export const postprocess = (
  trace: Trace,
  postProcessingConfiguration: PostprocessingConfiguration,
  randomSeed: string
): Trace => {
  const postProcessingSteps = postProcessingConfiguration.postProcessingSteps
  const randomGenerator = seedrandom(randomSeed)
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

  return trace
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

const performInsertion = (trace: Trace, event_id: number): Trace => {
  return insertDuplicate(trace, event_id)
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
