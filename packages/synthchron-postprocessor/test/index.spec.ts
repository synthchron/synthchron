// tslint:disable: only-arrow-functions
import { expect } from 'chai'

import {
  Configuration,
  StandardConfigurationTerminationType,
  Trace,
} from '@synthchron/simulator'

import { postprocess } from '../src'
import {
  PostProcessingConfiguration,
  PostProcessingStepType,
} from '../src/types'

describe('Testing delete functionality', function () {
  describe('Should delete 3 events', function () {
    it('Should delete 3 events from a single trace', function () {
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

      const steps: PostProcessingConfiguration = {
        stepProbability: 0.5,
        postProcessingSteps: [
          { type: PostProcessingStepType.DeletionStep, weight: 1 },
        ],
      }

      const config: Configuration = {
        endOnAcceptingStateProbability: 1,
        randomSeed: 'word',
        terminationType: {
          type: 'standard',
        } as StandardConfigurationTerminationType,
      }

      const result = postprocess(traces, steps, config)

      expect(result).to.deep.equal([
        {
          events: [
            { name: 'a', meta: {} },
            { name: 'd', meta: {} },
            { name: 'f', meta: {} },
          ],
        },
      ])
    })
  })
})

describe('Testing delete functionality', function () {
  describe('Should delete all 6 events', function () {
    it('Should delete all events in the log on a single trace', function () {
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

      const steps: PostProcessingConfiguration = {
        stepProbability: 1,
        postProcessingSteps: [
          { type: PostProcessingStepType.DeletionStep, weight: 1 },
        ],
      }

      const config: Configuration = {
        endOnAcceptingStateProbability: 1,
        randomSeed: 'abc',
        terminationType: {
          type: 'standard',
        } as StandardConfigurationTerminationType,
      }

      const result = postprocess(traces, steps, config)
      expect(result[0].events.length).to.equal(0)

      expect(result).to.deep.equal([
        {
          events: [],
        },
      ])
    })
  })
})

describe('Testing delete functionality', function () {
  describe('Should delete events on multiple traces', function () {
    it('Should delete events on multiple traces', function () {
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
        {
          events: [
            { name: 'g', meta: {} },
            { name: 'h', meta: {} },
            { name: 'i', meta: {} },
            { name: 'j', meta: {} },
            { name: 'k', meta: {} },
            { name: 'l', meta: {} },
          ],
        },
        {
          events: [
            { name: 'm', meta: {} },
            { name: 'n', meta: {} },
            { name: 'o', meta: {} },
            { name: 'p', meta: {} },
            { name: 'q', meta: {} },
            { name: 'r', meta: {} },
          ],
        },
      ]

      const steps: PostProcessingConfiguration = {
        stepProbability: 0.3,
        postProcessingSteps: [
          { type: PostProcessingStepType.DeletionStep, weight: 1 },
        ],
      }

      const config: Configuration = {
        endOnAcceptingStateProbability: 1,
        randomSeed: 'new',
        terminationType: {
          type: 'standard',
        } as StandardConfigurationTerminationType,
      }

      const result = postprocess(traces, steps, config)

      expect(result).to.deep.equal([
        {
          events: [
            { name: 'c', meta: {} },
            { name: 'd', meta: {} },
            { name: 'e', meta: {} },
          ],
        },
        {
          events: [
            { name: 'g', meta: {} },
            { name: 'h', meta: {} },
            { name: 'i', meta: {} },
            { name: 'j', meta: {} },
            { name: 'k', meta: {} },
            { name: 'l', meta: {} },
          ],
        },
        {
          events: [
            { name: 'm', meta: {} },
            { name: 'n', meta: {} },
            { name: 'p', meta: {} },
            { name: 'r', meta: {} },
          ],
        },
      ])
    })
  })
})

describe('Testing delete functionality', function () {
  describe('Should delete all events', function () {
    it('Should delete all events in the log on all traces', function () {
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
        {
          events: [
            { name: 'g', meta: {} },
            { name: 'h', meta: {} },
            { name: 'i', meta: {} },
            { name: 'j', meta: {} },
            { name: 'k', meta: {} },
            { name: 'l', meta: {} },
          ],
        },
        {
          events: [
            { name: 'm', meta: {} },
            { name: 'n', meta: {} },
            { name: 'o', meta: {} },
            { name: 'p', meta: {} },
            { name: 'q', meta: {} },
            { name: 'r', meta: {} },
          ],
        },
      ]

      const steps: PostProcessingConfiguration = {
        stepProbability: 1,
        postProcessingSteps: [
          { type: PostProcessingStepType.DeletionStep, weight: 1 },
        ],
      }

      const config: Configuration = {
        endOnAcceptingStateProbability: 1,
        randomSeed: 'random number',
        terminationType: {
          type: 'standard',
        } as StandardConfigurationTerminationType,
      }

      const result = postprocess(traces, steps, config)
      expect(result[0].events.length).to.equal(0)

      expect(result).to.deep.equal([
        {
          events: [],
        },
        {
          events: [],
        },
        {
          events: [],
        },
      ])
    })
  })
})
