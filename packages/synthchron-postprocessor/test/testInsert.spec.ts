// tslint:disable: only-arrow-functions
import { expect } from 'chai'

import { PostprocessingConfiguration } from '@synthchron/types'

import { postprocess } from '../src'
import { PostprocessingStepType } from '../src/enumTypes'
import { multipleTraces, singleTrace, testingConfig } from './testCommons'

export default function suite() {
  it('should return "good" when sending "good"', function () {
    expect(4).to.equal(4)
  })
}

export const insertTests =
  describe('Testing insertion functionality', function () {
    /*describe('Insert n events in traces', function () {
      it('Should insert 2 events in a single trace', function () {
        const insertConfig: PostprocessingConfiguration = {
          stepProbability: 1,
          postProcessingSteps: [
            { type: PostprocessingStepType.InsertionStep, weight: 1 },
          ],
        }
        const result = postprocess(singleTrace, insertConfig, testingConfig)

        expect(result).to.deep.equal([
          {
            events: [
              { name: 'a', meta: {} },
              { name: 'a', meta: {} },
              { name: 'b', meta: {} },
              { name: 'b', meta: {} },
              { name: 'c', meta: {} },
              { name: 'c', meta: {} },
              { name: 'd', meta: {} },
              { name: 'd', meta: {} },
              { name: 'e', meta: {} },
              { name: 'e', meta: {} },
              { name: 'f', meta: {} },
              { name: 'f', meta: {} },
            ],
          },
        ])
      })

      it('Should insert n events in multiple trace', function () {
        const insertConfig: PostprocessingConfiguration = {
          stepProbability: 0.3,
          postProcessingSteps: [
            { type: PostprocessingStepType.InsertionStep, weight: 1 },
          ],
        }

        const result = postprocess(multipleTraces, insertConfig, testingConfig)

        expect(result).to.deep.equal([
          {
            events: [
              { name: 'a', meta: {} },
              { name: 'b', meta: {} },
              { name: 'b', meta: {} },
              { name: 'c', meta: {} },
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
              { name: 'j', meta: {} },
              { name: 'k', meta: {} },
              { name: 'k', meta: {} },
              { name: 'l', meta: {} },
            ],
          },
          {
            events: [
              { name: 'm', meta: {} },
              { name: 'n', meta: {} },
              { name: 'o', meta: {} },
              { name: 'o', meta: {} },
              { name: 'p', meta: {} },
              { name: 'q', meta: {} },
              { name: 'r', meta: {} },
            ],
          },
        ])
      })
    })
    */

    describe('Insert all events', function () {
      it('Should duplicate all events in a single trace', function () {
        const insertConfig: PostprocessingConfiguration = {
          stepProbability: 1,
          postProcessingSteps: [
            { type: PostprocessingStepType.InsertionStep, weight: 1 },
          ],
        }

        const result = postprocess(singleTrace, insertConfig, testingConfig)
        expect(result[0].events.length).to.equal(12)

        expect(result).to.deep.equal([
          {
            events: [
              { name: 'a', meta: {} },
              { name: 'a', meta: {} },
              { name: 'b', meta: {} },
              { name: 'b', meta: {} },
              { name: 'c', meta: {} },
              { name: 'c', meta: {} },
              { name: 'd', meta: {} },
              { name: 'd', meta: {} },
              { name: 'e', meta: {} },
              { name: 'e', meta: {} },
              { name: 'f', meta: {} },
              { name: 'f', meta: {} },
            ],
          },
        ])
      })

      it('Should duplicate all events in all traces', function () {
        const insertConfig: PostprocessingConfiguration = {
          stepProbability: 1,
          postProcessingSteps: [
            { type: PostprocessingStepType.InsertionStep, weight: 1 },
          ],
        }

        const result = postprocess(multipleTraces, insertConfig, testingConfig)
        expect(result[2].events.length).to.equal(12)

        expect(result).to.deep.equal([
          {
            events: [
              { name: 'a', meta: {} },
              { name: 'a', meta: {} },
              { name: 'b', meta: {} },
              { name: 'b', meta: {} },
              { name: 'c', meta: {} },
              { name: 'c', meta: {} },
              { name: 'd', meta: {} },
              { name: 'd', meta: {} },
              { name: 'e', meta: {} },
              { name: 'e', meta: {} },
              { name: 'f', meta: {} },
              { name: 'f', meta: {} },
            ],
          },
          {
            events: [
              { name: 'g', meta: {} },
              { name: 'g', meta: {} },
              { name: 'h', meta: {} },
              { name: 'h', meta: {} },
              { name: 'i', meta: {} },
              { name: 'i', meta: {} },
              { name: 'j', meta: {} },
              { name: 'j', meta: {} },
              { name: 'k', meta: {} },
              { name: 'k', meta: {} },
              { name: 'l', meta: {} },
              { name: 'l', meta: {} },
            ],
          },
          {
            events: [
              { name: 'm', meta: {} },
              { name: 'm', meta: {} },
              { name: 'n', meta: {} },
              { name: 'n', meta: {} },
              { name: 'o', meta: {} },
              { name: 'o', meta: {} },
              { name: 'p', meta: {} },
              { name: 'p', meta: {} },
              { name: 'q', meta: {} },
              { name: 'q', meta: {} },
              { name: 'r', meta: {} },
              { name: 'r', meta: {} },
            ],
          },
        ])
      })
    })
  })
