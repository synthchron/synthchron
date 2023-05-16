// tslint:disable: only-arrow-functions
import { expect } from 'chai'

import {
  StandardConfigurationTerminationType,
  TerminationType,
  Trace,
} from '@synthchron/simulator'

import { main } from '../src'
import { postprocess } from '../src/postprocess'
import { PostProcessingStepType } from '../src/types'

describe('Index module', function () {
  describe('expected behavior', function () {
    it('should return hello world', function () {
      expect(main()).to.equal('Hello World')
    })
  })
})

// TODO: Tests once we have XES parsing
/*
describe('Testing delete', function () {
	describe('Should delete all events', function () {
		it('Should delete all events in the log', function () {
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
						}
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

			expect(answer[0].events.length).to.equal(0)
		})
	})
})
*/

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
