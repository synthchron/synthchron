// tslint:disable: only-arrow-functions
import { expect } from 'chai'

import {
  StandardConfigurationTerminationType,
  terminationType,
} from '@synthchron/simulator'

import { simulateWithEngine } from '../src'
import { flowchart1 } from '../src/model-examples/flowchartExamples'
import {
  petriNet1,
  petriNet2,
  petriNet3,
} from '../src/model-examples/petriNetExamples'
import { petriNetEngine } from '../src/process-engines/petrinet-engine'

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

    it('Petri Net 1: 1.should produce the correct trace', () => {
      expect(
        simulateWithEngine(
          petriNet1,
          {
            endOnAcceptingStateProbability: 1,
            randomSeed: '42',
            terminationType: { type: terminationType.Standard },
          },
          petriNetEngine
        )
      ).to.deep.equal({
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

    it('Petri Net 1: 2.should produce the correct trace', () => {
      expect(
        simulateWithEngine(
          petriNet1,
          {
            endOnAcceptingStateProbability: 1,
            randomSeed: '42',
            terminationType: { type: terminationType.Standard },
          },
          petriNetEngine
        )
      ).to.deep.equal({
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

    it('Petri Net 1: 3.should produce the correct trace', () => {
      expect(
        simulateWithEngine(
          petriNet1,
          {
            endOnAcceptingStateProbability: 0,
            randomSeed: '42',
            terminationType: { type: terminationType.Standard },
          },
          petriNetEngine
        )
      ).to.deep.equal({
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

    it('should produce the correct trace', () => {
      expect(
        simulateWithEngine(
          petriNet1,
          {
            maxEvents: 0,
            randomSeed: '42',
            endOnAcceptingStateProbability: 0,
            terminationType: { type: terminationType.Standard },
          },
          petriNetEngine
        )
      ).to.deep.equal({
        acceptingState: undefined,
        exitReason: 'maxStepsReached',
        trace: {
          events: [],
        },
      })
    })

    it('should produce the correct trace', () => {
      expect(
        simulateWithEngine(
          petriNet1,
          {
            maxEvents: 0,
            randomSeed: '42',
            endOnAcceptingStateProbability: 0,
            terminationType: { type: terminationType.Standard },
          },
          petriNetEngine
        )
      ).to.deep.equal({
        acceptingState: undefined,
        exitReason: 'maxStepsReached',
        trace: {
          events: [],
        },
      })
    })

    it('should produce the correct trace', () => {
      expect(
        simulateWithEngine(
          petriNet1,
          {
            maxEvents: 1,
            randomSeed: '42',
            endOnAcceptingStateProbability: 0,
            terminationType: { type: terminationType.Standard },
          },
          petriNetEngine
        )
      ).to.deep.equal({
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

    it('should produce the correct trace', () => {
      expect(
        simulateWithEngine(
          petriNet2,
          {
            endOnAcceptingStateProbability: 1,
            randomSeed: '42',
            terminationType: { type: terminationType.Standard },
          },
          petriNetEngine
        )
      ).to.deep.equal({
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

    it('should produce the correct trace', () => {
      expect(
        simulateWithEngine(
          petriNet2,
          {
            endOnAcceptingStateProbability: 0,
            randomSeed: '42',
            terminationType: { type: terminationType.Standard },
          },
          petriNetEngine
        )
      ).to.deep.equal({
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

    it('should produce the correct trace', () => {
      expect(
        simulateWithEngine(
          petriNet2,
          {
            maxEvents: 0,
            randomSeed: '42',
            endOnAcceptingStateProbability: 0,
            terminationType: { type: terminationType.Standard },
          },
          petriNetEngine
        )
      ).to.deep.equal({
        acceptingState: undefined,
        exitReason: 'maxStepsReached',
        trace: {
          events: [],
        },
      })
    })

    it('should produce the correct trace', () => {
      expect(
        simulateWithEngine(
          petriNet2,
          {
            maxEvents: 1,
            randomSeed: '42',
            endOnAcceptingStateProbability: 0,
            terminationType: { type: terminationType.Standard },
          },
          petriNetEngine
        )
      ).to.deep.equal({
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
    it('Petri Net 3.2: should produce the correct trace', () => {
      expect(
        simulateWithEngine(
          petriNet3,
          {
            endOnAcceptingStateProbability: 1,
            randomSeed: '42',
            terminationType: { type: terminationType.Standard },
          },
          petriNetEngine
        )
      ).to.deep.equal({
        acceptingState: 'accepting',
        exitReason: 'acceptingStateReached',
        trace: {
          events: [],
        },
      })
    })
    it('Petri Net 3.3: should produce the correct trace', () => {
      expect(
        simulateWithEngine(
          petriNet3,
          {
            endOnAcceptingStateProbability: 0,
            randomSeed: '42',
            terminationType: { type: terminationType.Standard },
          },
          petriNetEngine
        )
      ).to.deep.equal({
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
    it('Petri Net 3.4: should produce the correct trace', () => {
      expect(
        simulateWithEngine(
          petriNet3,
          {
            minEvents: 0,
            randomSeed: '42',
            endOnAcceptingStateProbability: 0,
            terminationType: { type: terminationType.Standard },
          },
          petriNetEngine
        )
      ).to.deep.equal({
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
    it('Petri Net 3.5: should produce the correct trace', () => {
      expect(
        simulateWithEngine(
          petriNet3,
          {
            maxEvents: 3,
            endOnAcceptingStateProbability: 1,
            randomSeed: '42',
            terminationType: { type: terminationType.Standard },
          },
          petriNetEngine
        )
      ).to.deep.equal({
        acceptingState: 'accepting',
        exitReason: 'acceptingStateReached',
        trace: {
          events: [],
        },
      })
    })
  })

  describe('Flow Chart 1', () => {
    it('should not work with the petri net process engine', () => {
      expect(() =>
        // Allow wrong types for testing purposes
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        simulateWithEngine(
          flowchart1,
          {
            randomSeed: '42',
            endOnAcceptingStateProbability: 0,
            terminationType: { type: terminationType.Standard },
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          petriNetEngine as any
        )
      ).to.throw()
    })
  })
})
