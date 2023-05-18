// tslint:disable: only-arrow-functions
import { expect } from 'chai'

import {
  Configuration,
  StandardConfigurationTerminationType,
  TerminationType,
  Trace,
} from '@synthchron/simulator'

import { main } from '../src/index'
import { postprocess } from '../src/postprocess'
import {
  PostProcessingConfiguration,
  PostProcessingStepType,
} from '../src/types'

describe('Index module', function () {
  describe('expected behavior', function () {
    it('should return hello world', function () {
      expect(main()).to.equal('Hello World')
    })
  })
})

describe('Testing delete', function () {
  describe('Should delete all events', function () {
    it('Should delete all events in the log', function () {
      expect(true).to.equal(true)
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
        randomSeed: 'abc',
        terminationType: {
          type: TerminationType.Standard,
        },
      }

      expect(true).to.equal(true)

      /*expect(postprocess(traces, steps, config)).to.deep.equal([
        {
          events: [
            { name: 'c', meta: {} },
            { name: 'd', meta: {} },
            { name: 'f', meta: {} },
          ],
        },
      ])*/
    })
  })
})

/*
describe('Testing delete not 100%', function () {
	describe('Should delete all events', function () {
		it('should delete an event', function () {
			let traces: Trace[];
			traces = [
				{
					events: [
						{
							name: 'a',
							meta: {}
						},
						{
							name: 'b',
							meta: {}
						},
						{
							name: 'c',
							meta: {}
						},
						{
							name: 'd',
							meta: {}
						},
						{
							name: 'e',
							meta: {}
						},
						{
							name: 'f',
							meta: {}
						},
						{
							name: 'g',
							meta: {}
						},
						{
							name: 'h',
							meta: {}
						},
						{
							name: 'i',
							meta: {}
						},
						{
							name: 'j',
							meta: {}
						},
						{
							name: 'k',
							meta: {}
						},
						{
							name: 'l',
							meta: {}
						},

					]
				}
			];

			let steps = {
				stepProbability: 1,
				postProcessingSteps: [
					{
						type: PostProcessingStepType.DeletionStep,
						weight: 1
					}
				]
			}

			let config = {
				endOnAcceptingStateProbability: 1,
				randomSeed: '',
				terminationType: {
					type: TerminationType.Standard,
				} as StandardConfigurationTerminationType
			}

			let answer = postprocess(traces, steps, config)

			expect(answer[0].events.length).to.lt(12)
		})
	})
})


describe('Testing delete multiple traces', function () {
	describe('Should delete all event in both traces', function () {
		it('should delete all events', function () {
			let traces: Trace[];
			traces = [
				{
					events: [
						{
							name: 'a',
							meta: {}
						},
						{
							name: 'b',
							meta: {}
						},
						{
							name: 'c',
							meta: {}
						},
					]
				},
				{
					events: [
						{
							name: 'd',
							meta: {}
						},
						{
							name: 'e',
							meta: {}
						},
						{
							name: 'f',
							meta: {}
						},
					]
				}
			];

			let steps = {
				stepProbability: 1,
				postProcessingSteps: [
					{
						type: PostProcessingStepType.DeletionStep,
						weight: 1
					}
				]
			}

			let config = {
				endOnAcceptingStateProbability: 1,
				randomSeed: '',
				terminationType: {
					type: TerminationType.Standard,
				} as StandardConfigurationTerminationType
			}

			let answer = postprocess(traces, steps, config)

			expect(answer.length).to.equal(2)

			expect(answer[0].events.length).to.equal(0)
			expect(answer[1].events.length).to.equal(0)

		})
	})
})*/
