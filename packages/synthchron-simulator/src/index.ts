export const main = (): string => 'Hello World'

// Top level simulate command. Can take a configuration dictionary
export { simulate, simulateWithEngine } from './simulation'

export * from './types/processModel';

export * from './model-examples/petriNetExamples'
