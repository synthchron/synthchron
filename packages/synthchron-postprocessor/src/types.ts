export type PostProcessingConfiguration = {
	postProcessingSteps: PostProcessingSteps
	stepProbability: number
}

export type PostProcessingSteps = SimpleSteps[]

export enum PostProcessingStepType {
	DeletionStep = 'deletion',
	SwapStep = 'swap',
	InsertionStep = 'insertion',
}

export type SimpleSteps = {
	type: PostProcessingStepType.DeletionStep
		| PostProcessingStepType.SwapStep
		| PostProcessingStepType.InsertionStep
	weight: number
}