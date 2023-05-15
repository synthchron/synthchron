export const main = () : string => 'Hello World'

// Top level simulate command. Can take a configuration dictionary
export { simulateWithEngine } from './simulation'

export * from './types/processModelTypes'

export * from './model-examples/petriNetExamples'
export * from './model-examples/flowchartExamples'

export * from './process-engines/petrinet-engine'

export * from './types/processModelTypes/petriNetTypes'

export * from './types/simulationTypes'
