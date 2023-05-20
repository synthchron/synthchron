export type PostprocessingConfiguration = {
  postProcessingSteps: PostprocessingSteps
  stepProbability: number
}

export type PostprocessingSteps = SimpleSteps[]

export const enum PostprocessingStepType {
  DeletionStep = 'deletion',
  SwapStep = 'swap',
  InsertionStep = 'insertion',
}

export type SimpleSteps = {
  type:
    | PostprocessingStepType.DeletionStep
    | PostprocessingStepType.SwapStep
    | PostprocessingStepType.InsertionStep
  weight: number
}
