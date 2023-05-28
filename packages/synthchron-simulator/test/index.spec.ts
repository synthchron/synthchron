/* eslint-disable @typescript-eslint/no-explicit-any */
// tslint:disable: only-arrow-functions
import { fail } from 'assert'
import { expect } from 'chai'

import { Configuration } from '@synthchron/types'

import { simulateTraceWithEngine, simulateWithEngine } from '../src'
import { flowchart1 } from '../src/model-examples/flowchartExamples'
import {
  petriNet1,
  petriNet2,
  petriNet3,
  petriNet4,
} from '../src/model-examples/petriNetExamples'
import { petriNetEngine } from '../src/process-engines/petrinet-engine'
import { TerminationType } from '../src/types/enumTypes'

const noPostprocessing: Pick<Configuration, 'postprocessing'> = {
  postprocessing: {
    stepProbability: 0,
    postProcessingSteps: [],
  },
}

const defaultConfiguration: Configuration = {
  endOnAcceptingStateProbability: 1,
  randomSeed: '42',
  terminationType: { type: TerminationType.Standard },
  ...noPostprocessing,
  uniqueTraces: false,
  maximumTraces: 1,
}

describe('Deterministic Process Models', () => {
  describe('Petri Net 1', () => {
    it('should be accepting after one transition', () => {
      const initialState = petriNetEngine.resetActivity(petriNet1)
      expect(petriNetEngine.isAccepting(petriNet1, initialState).isAccepting).to
        .be.false
      const nextState = petriNetEngine.executeActivity(
        petriNet1,
        initialState,
        't1'
      )
      expect(petriNetEngine.isAccepting(petriNet1, nextState).isAccepting).to.be
        .true
    })

    it('Petri Net 1: 1.should produce the correct trace', async () => {
      const result = await simulateTraceWithEngine(
        petriNet1,
        { ...defaultConfiguration, endOnAcceptingStateProbability: 1 },
        petriNetEngine,
        (() => 0) as any // A random generator that always returns 0
      )
      expect(result).to.deep.equal({
        acceptingState: 'accepting',
        exitReason: 'acceptingStateReached',
        trace: {
          events: [
            {
              name: 't1',
              meta: {},
            },
          ],
        },
      })
    })

    it('Petri Net 1: 2.should produce the correct trace', async () => {
      const result = await simulateTraceWithEngine(
        petriNet1,
        {
          ...defaultConfiguration,
          endOnAcceptingStateProbability: 1,
        },
        petriNetEngine,
        (() => 0) as any // A random generator that always returns 0
      )
      expect(result).to.deep.equal({
        acceptingState: 'accepting',
        exitReason: 'acceptingStateReached',
        trace: {
          events: [
            {
              name: 't1',
              meta: {},
            },
          ],
        },
      })
    })

    it('Petri Net 1: 3.should produce the correct trace', async () => {
      const result = await simulateTraceWithEngine(
        petriNet1,
        {
          ...defaultConfiguration,
          endOnAcceptingStateProbability: 0,
        },
        petriNetEngine,
        (() => 0) as any // A random generator that always returns 0
      )
      expect(result).to.deep.equal({
        acceptingState: undefined,
        exitReason: 'noEnabledActivities',
        trace: {
          events: [
            {
              name: 't1',
              meta: {},
            },
            {
              name: 't1',
              meta: {},
            },
          ],
        },
      })
    })

    it('should produce the correct trace', async () => {
      const result = await simulateTraceWithEngine(
        petriNet1,
        {
          ...defaultConfiguration,
          maxEvents: 0,
          endOnAcceptingStateProbability: 0,
        },
        petriNetEngine,
        (() => 0) as any // A random generator that always returns 0
      )
      expect(result).to.deep.equal({
        acceptingState: undefined,
        exitReason: 'maxStepsReached',
        trace: {
          events: [],
        },
      })
    })

    it('should produce the correct trace', async () => {
      const result = await simulateTraceWithEngine(
        petriNet1,
        {
          ...defaultConfiguration,
          maxEvents: 0,
          endOnAcceptingStateProbability: 0,
        },
        petriNetEngine,
        (() => 0) as any // A random generator that always returns 0
      )

      expect(result).to.deep.equal({
        acceptingState: undefined,
        exitReason: 'maxStepsReached',
        trace: {
          events: [],
        },
      })
    })

    it('should produce the correct trace', async () => {
      const result = await simulateTraceWithEngine(
        petriNet1,
        {
          ...defaultConfiguration,
          maxEvents: 1,
          endOnAcceptingStateProbability: 0,
        },
        petriNetEngine,
        (() => 0) as any // A random generator that always returns 0
      )

      expect(result).to.deep.equal({
        acceptingState: undefined,
        exitReason: 'maxStepsReached',
        trace: {
          events: [
            {
              name: 't1',
              meta: {},
            },
          ],
        },
      })
    })
  })

  describe('Petri Net 2', () => {
    it('should be accepting after one transition', () => {
      const initialState = petriNetEngine.resetActivity(petriNet2)
      expect(petriNetEngine.isAccepting(petriNet1, initialState).isAccepting).to
        .be.false
      const nextState = petriNetEngine.executeActivity(
        petriNet2,
        initialState,
        't1'
      )
      expect(petriNetEngine.isAccepting(petriNet1, nextState).isAccepting).to.be
        .true
    })

    it('should produce the correct trace', async () => {
      const result = await simulateTraceWithEngine(
        petriNet2,
        {
          ...defaultConfiguration,
          endOnAcceptingStateProbability: 1,
        },
        petriNetEngine,
        (() => 0) as any // A random generator that always returns 0
      )

      expect(result).to.deep.equal({
        acceptingState: 'accepting',
        exitReason: 'acceptingStateReached',
        trace: {
          events: [
            {
              name: 't1',
              meta: {},
            },
          ],
        },
      })
    })

    it('should produce the correct trace', async () => {
      const result = await simulateTraceWithEngine(
        petriNet2,
        {
          ...defaultConfiguration,
          endOnAcceptingStateProbability: 0,
        },
        petriNetEngine,
        (() => 0) as any // A random generator that always returns 0
      )

      expect(result).to.deep.equal({
        acceptingState: undefined,
        exitReason: 'noEnabledActivities',
        trace: {
          events: [
            {
              name: 't1',
              meta: {},
            },
            {
              name: 't1',
              meta: {},
            },
          ],
        },
      })
    })

    it('should produce the correct trace', async () => {
      const result = await simulateTraceWithEngine(
        petriNet2,
        {
          ...defaultConfiguration,
          maxEvents: 0,
          endOnAcceptingStateProbability: 0,
        },
        petriNetEngine,
        (() => 0) as any // A random generator that always returns 0
      )

      expect(result).to.deep.equal({
        acceptingState: undefined,
        exitReason: 'maxStepsReached',
        trace: {
          events: [],
        },
      })
    })

    it('should produce the correct trace', async () => {
      const result = await simulateTraceWithEngine(
        petriNet2,
        {
          ...defaultConfiguration,
          maxEvents: 1,
          endOnAcceptingStateProbability: 0,
        },
        petriNetEngine,
        (() => 0) as any // A random generator that always returns 0
      )

      expect(result).to.deep.equal({
        acceptingState: undefined,
        exitReason: 'maxStepsReached',
        trace: {
          events: [
            {
              name: 't1',
              meta: {},
            },
          ],
        },
      })
    })
  })
  describe('Petri Net 3', () => {
    it('Petri Net 3.1: should go from accepting to not accepting', () => {
      const initialState = petriNetEngine.resetActivity(petriNet3)
      expect(petriNetEngine.isAccepting(petriNet3, initialState).isAccepting).to
        .be.true
      const nextState = petriNetEngine.executeActivity(
        petriNet3,
        initialState,
        't1'
      )
      expect(petriNetEngine.isAccepting(petriNet3, nextState).isAccepting).to.be
        .false
    })
    it('Petri Net 3.2: should produce the correct trace', async () => {
      const result = await simulateTraceWithEngine(
        petriNet3,
        {
          ...defaultConfiguration,
          endOnAcceptingStateProbability: 1,
        },
        petriNetEngine,
        (() => 0) as any // A random generator that always returns 0
      )

      expect(result).to.deep.equal({
        acceptingState: 'accepting',
        exitReason: 'acceptingStateReached',
        trace: {
          events: [],
        },
      })
    })
    it('Petri Net 3.3: should produce the correct trace', async () => {
      const result = await simulateTraceWithEngine(
        petriNet3,
        {
          ...defaultConfiguration,
          endOnAcceptingStateProbability: 0,
        },
        petriNetEngine,
        (() => 0) as any // A random generator that always returns 0
      )

      expect(result).to.deep.equal({
        acceptingState: undefined,
        exitReason: 'noEnabledActivities',
        trace: {
          events: [
            {
              name: 't1',
              meta: {},
            },
            {
              name: 't1',
              meta: {},
            },
          ],
        },
      })
    })
    it('Petri Net 3.4: should produce the correct trace', async () => {
      const result = await simulateTraceWithEngine(
        petriNet3,
        {
          ...defaultConfiguration,
          minEvents: 0,
          endOnAcceptingStateProbability: 0,
        },
        petriNetEngine,
        (() => 0) as any // A random generator that always returns 0
      )

      expect(result).to.deep.equal({
        acceptingState: undefined,
        exitReason: 'noEnabledActivities',
        trace: {
          events: [
            {
              name: 't1',
              meta: {},
            },
            {
              name: 't1',
              meta: {},
            },
          ],
        },
      })
    })
    it('Petri Net 3.5: should produce the correct trace', async () => {
      const result = await simulateTraceWithEngine(
        petriNet3,
        {
          ...defaultConfiguration,
          maxEvents: 3,
          endOnAcceptingStateProbability: 1,
        },
        petriNetEngine,
        (() => 0) as any // A random generator that always returns 0
      )

      expect(result).to.deep.equal({
        acceptingState: 'accepting',
        exitReason: 'acceptingStateReached',
        trace: {
          events: [],
        },
      })
    })
  })

  describe('Flow Chart 1', () => {
    it('should throw an error when petriNetEngine is not an instance of PetriNetEngine', async () => {
      try {
        // Allow wrong types for testing purposes
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for await (const _ of simulateWithEngine(
          flowchart1,
          {
            ...defaultConfiguration,
            endOnAcceptingStateProbability: 0,
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          petriNetEngine as any
        )) {
          // Do nothing
        }
        fail('Expected simulateWithEngine to throw an error')
      } catch (error) {
        expect(error.message).to.equal(
          `Process engine petri-net cannot be used with process model flowchart`
        )
      }
    })
  })
})

describe('Mass Trace Simulations', () => {
  describe('Reaching Max Steps', () => {
    it('Should produce 2 traces', async () => {
      let result
      const simulator = simulateWithEngine(
        petriNet1,
        {
          ...defaultConfiguration,
          maxEvents: 2,
          endOnAcceptingStateProbability: 0,
          maximumTraces: 2,
        },
        petriNetEngine
      )
      for await (const trace of simulator) {
        result = trace
      }
      expect(result).to.deep.equal({
        progress: 100,
        simulationLog: {
          simulationResults: [
            {
              trace: {
                events: [
                  {
                    name: 't1',
                    meta: {},
                  },
                  {
                    name: 't1',
                    meta: {},
                  },
                ],
              },
              acceptingState: undefined,
              exitReason: 'maxStepsReached',
            },
            {
              trace: {
                events: [
                  {
                    name: 't1',
                    meta: {},
                  },
                  {
                    name: 't1',
                    meta: {},
                  },
                ],
              },
              acceptingState: undefined,
              exitReason: 'maxStepsReached',
            },
          ],
        },
      })
    })
  })

  describe('Reaching Specific number of traces', () => {
    it('Specified number of traces < Max', async () => {
      let result
      const simulator = simulateWithEngine(
        petriNet1,
        {
          ...defaultConfiguration,
          maxEvents: 2,
          endOnAcceptingStateProbability: 0,
          maximumTraces: 4,
          terminationType: {
            type: TerminationType.SpecifiedAmountOfTraces,
            amountOfTraces: 2,
          },
        },
        petriNetEngine
      )
      for await (const trace of simulator) {
        result = trace
      }
      expect(result).to.deep.equal({
        progress: 100,
        simulationLog: {
          simulationResults: [
            {
              trace: {
                events: [
                  {
                    name: 't1',
                    meta: {},
                  },
                  {
                    name: 't1',
                    meta: {},
                  },
                ],
              },
              acceptingState: undefined,
              exitReason: 'maxStepsReached',
            },
            {
              trace: {
                events: [
                  {
                    name: 't1',
                    meta: {},
                  },
                  {
                    name: 't1',
                    meta: {},
                  },
                ],
              },
              acceptingState: undefined,
              exitReason: 'maxStepsReached',
            },
          ],
        },
      })
    })

    it('Specified number of traces > Max', async () => {
      let result
      const simulator = simulateWithEngine(
        petriNet1,
        {
          ...defaultConfiguration,
          maxEvents: 2,
          endOnAcceptingStateProbability: 0,
          maximumTraces: 2,
          terminationType: {
            type: TerminationType.SpecifiedAmountOfTraces,
            amountOfTraces: 4,
          },
        },
        petriNetEngine
      )
      for await (const trace of simulator) {
        result = trace
      }
      expect(result).to.deep.equal({
        progress: 100,
        simulationLog: {
          simulationResults: [
            {
              trace: {
                events: [
                  {
                    name: 't1',
                    meta: {},
                  },
                  {
                    name: 't1',
                    meta: {},
                  },
                ],
              },
              acceptingState: undefined,
              exitReason: 'maxStepsReached',
            },
            {
              trace: {
                events: [
                  {
                    name: 't1',
                    meta: {},
                  },
                  {
                    name: 't1',
                    meta: {},
                  },
                ],
              },
              acceptingState: undefined,
              exitReason: 'maxStepsReached',
            },
          ],
        },
      })
    })
  })
  describe('Reaching Coverage', () => {
    it('Reaching full coverage', async () => {
      let result
      const simulator = simulateWithEngine(
        petriNet1,
        {
          ...defaultConfiguration,
          maxEvents: 2,
          endOnAcceptingStateProbability: 0,
          maximumTraces: 2,
          terminationType: {
            type: TerminationType.Coverage,
            coverage: 1,
          },
        },
        petriNetEngine
      )
      for await (const trace of simulator) {
        result = trace
      }
      expect(result).to.deep.equal({
        progress: 100,
        simulationLog: {
          simulationResults: [
            {
              trace: {
                events: [
                  {
                    name: 't1',
                    meta: {},
                  },
                  {
                    name: 't1',
                    meta: {},
                  },
                ],
              },
              acceptingState: undefined,
              exitReason: 'maxStepsReached',
            },
          ],
        },
      })
    })
    it('Reaching full coverage with multiple transitions', async () => {
      let result
      const simulator = simulateWithEngine(
        petriNet4,
        {
          ...defaultConfiguration,
          maxEvents: 2,
          endOnAcceptingStateProbability: 0,
          maximumTraces: 2,
          terminationType: {
            type: TerminationType.Coverage,
            coverage: 1,
          },
        },
        petriNetEngine
      )
      for await (const trace of simulator) {
        result = trace
      }
      expect(result).to.have.property('progress', 100)
      expect(result).to.have.property('simulationLog')
      expect(result.simulationLog).to.have.property('simulationResults')
      expect(result.simulationLog.simulationResults).to.have.length(2)
    })
  })
})
