// tslint:disable: only-arrow-functions
import { expect } from 'chai'

import { Trace } from '@synthchron/simulator/src/types/simulationTypes'
import { PostprocessingConfiguration } from '@synthchron/types'

import { postprocess } from '../src'
import { PostprocessingStepType } from '../src/enumTypes'
import { testingConfig } from './testCommons'

describe('Testing swap step', function () {
  const swapConfig: PostprocessingConfiguration = {
    stepProbability: 1,
    postProcessingSteps: [{ type: PostprocessingStepType.SwapStep, weight: 1 }],
  }

  const postProcessingConfig = {
    ...testingConfig,
    postprocessing: swapConfig,
    randomSeed: 'random',
  }

  describe('Swap all events', function () {
    it('Swapping trace of no events has no effect', function () {
      const traces: Trace[] = [
        {
          events: [],
        },
      ]
      const result = postprocess(traces, postProcessingConfig)
      expect(result).to.deep.equal([
        {
          events: [],
        },
      ])
    })
    it('Swapping trace of one event has no effect', function () {
      const traces: Trace[] = [
        {
          events: [{ name: 'a', meta: {} }],
        },
      ]
      const result = postprocess(traces, postProcessingConfig)

      expect(result).to.deep.equal([
        {
          events: [{ name: 'a', meta: {} }],
        },
      ])
    })

    it('Swapping trace of two events', function () {
      const traces: Trace[] = [
        {
          events: [
            { name: 'a', meta: {} },
            { name: 'b', meta: {} },
          ],
        },
      ]

      const result = postprocess(traces, postProcessingConfig)

      expect(result).to.deep.equal([
        {
          events: [
            { name: 'b', meta: {} },
            { name: 'a', meta: {} },
          ],
        },
      ])
    })

    it('Swapping trace of three events', function () {
      const traces: Trace[] = [
        {
          events: [
            { name: 'a', meta: {} },
            { name: 'b', meta: {} },
            { name: 'c', meta: {} },
          ],
        },
      ]

      const result = postprocess(traces, postProcessingConfig)

      expect(result).to.deep.equal([
        {
          events: [
            { name: 'b', meta: {} },
            { name: 'a', meta: {} },
            { name: 'c', meta: {} },
          ],
        },
      ])
    })
    it('Swapping trace of four events', function () {
      const traces: Trace[] = [
        {
          events: [
            { name: 'a', meta: {} },
            { name: 'b', meta: {} },
            { name: 'c', meta: {} },
            { name: 'd', meta: {} },
          ],
        },
      ]

      const result = postprocess(traces, postProcessingConfig)

      expect(result).to.deep.equal([
        {
          events: [
            { name: 'b', meta: {} },
            { name: 'a', meta: {} },
            { name: 'd', meta: {} },
            { name: 'c', meta: {} },
          ],
        },
      ])
    })
    it('Swapping four events on multiple traces', function () {
      const traces: Trace[] = [
        {
          events: [
            { name: 'a', meta: {} },
            { name: 'b', meta: {} },
            { name: 'c', meta: {} },
            { name: 'd', meta: {} },
          ],
        },
        {
          events: [
            { name: 'e', meta: {} },
            { name: 'f', meta: {} },
            { name: 'g', meta: {} },
            { name: 'h', meta: {} },
          ],
        },
        {
          events: [
            { name: 'i', meta: {} },
            { name: 'j', meta: {} },
            { name: 'k', meta: {} },
            { name: 'l', meta: {} },
          ],
        },
      ]

      const result = postprocess(traces, postProcessingConfig)

      expect(result).to.deep.equal([
        {
          events: [
            { name: 'b', meta: {} },
            { name: 'a', meta: {} },
            { name: 'd', meta: {} },
            { name: 'c', meta: {} },
          ],
        },
        {
          events: [
            { name: 'f', meta: {} },
            { name: 'e', meta: {} },
            { name: 'h', meta: {} },
            { name: 'g', meta: {} },
          ],
        },
        {
          events: [
            { name: 'j', meta: {} },
            { name: 'i', meta: {} },
            { name: 'l', meta: {} },
            { name: 'k', meta: {} },
          ],
        },
      ])
    })
  })

  describe('Swap some events', function () {
    const newConfig = {
      ...swapConfig,
      stepProbability: 0.5,
    }
    const postProcessingConfig = {
      ...testingConfig,
      postprocessing: newConfig,
      randomSeed: 'random',
    }
    it('Swapping trace of six events', function () {
      const traces: Trace[] = [
        {
          events: [
            { name: 'a', meta: {} },
            { name: 'b', meta: {} },
            { name: 'c', meta: {} },
            { name: 'd', meta: {} },
            { name: 'e', meta: {} },
            { name: 'f', meta: {} },
          ],
        },
      ]

      const result = postprocess(traces, postProcessingConfig)

      expect(result).to.deep.equal([
        {
          events: [
            { name: 'a', meta: {} },
            { name: 'c', meta: {} },
            { name: 'b', meta: {} },
            { name: 'd', meta: {} },
            { name: 'f', meta: {} },
            { name: 'e', meta: {} },
          ],
        },
      ])
    })
  })
})
