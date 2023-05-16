import {Configuration, Trace} from "@synthchron/simulator";
import {PostProcessingConfiguration, PostProcessingStepType, SimpleSteps} from "./types";
import seedrandom from 'seedrandom'

export const postprocess = (traces: Trace[], postProcessingConfiguration: PostProcessingConfiguration, configuration: Configuration) : Trace[] => {
	const randomGenerator = seedrandom(configuration.randomSeed)
	traces.forEach(trace => {
		// using for loop, to get the correct index to identify the event
		for (let i = 0; i < trace.events.length; i++) {
			const random = randomGenerator()
			if (random < postProcessingConfiguration.stepProbability) {
				let postProcessingSteps: Set<[SimpleSteps, number]> = new Set()
				for (let x of postProcessingConfiguration.postProcessingSteps) {
					postProcessingSteps.add([x, x.weight])
				}
				const postProcessingStep = weightedRandom(postProcessingSteps, randomGenerator)

				// TODO: SELECT the step
				// TODO: apply step
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

const weightedRandom = <T>(
	activities: Set<[T, number]>,
	randomGenerator: seedrandom.PRNG
): T => {
	const cumulativeWeights: [T, number][] = []
	let cumulativeWeight = 0
	for (const [activity, weight] of activities) {
		cumulativeWeight += weight
		cumulativeWeights.push([activity, cumulativeWeight])
	}
	const random = randomGenerator() * cumulativeWeight
	for (const [activity, cumulativeWeight] of cumulativeWeights) {
		if (random <= cumulativeWeight) return activity
	}
	throw new Error('Weighted random failed')
}

const performDeletion = (trace: Trace, event_id: number) : Trace => {
	trace.events.splice(event_id, 1)
	return trace
}

const performSwap = (trace: Trace, event_id: number) : Trace => {
	return trace
}

const performInsertion = (trace: Trace, event_id: number) : Trace => {
	return trace
}