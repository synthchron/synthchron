// tslint:disable: only-arrow-functions
import { expect } from 'chai';
import { main } from '../src';
import { flowchart1 } from '../src/model-examples/flowchart';
import { petriNet1, petriNet2 } from '../src/model-examples/petriNet';
import { petriNetEngine } from '../src/process-engines/petrinet-engine';
import { simulate, simulateWithEngine } from '../src/simulation';

describe('Index module', function() {
  describe('expected behavior', function() {
    it('should return hello world', function() {
      expect(main()).to.equal('Hello World');
    });
  });
});

describe('Deterministic Process Models', () => {
  describe('Petri Net 1', () => {
    it('should be accepting after one transition', () => {
      const initialState = petriNetEngine.resetActivity(petriNet1);
      expect(petriNetEngine.isAccepting(petriNet1, initialState)).to.be.false;
      const nextState = petriNetEngine.executeActivity(petriNet1, initialState, 't1');
      expect(petriNetEngine.isAccepting(petriNet1, nextState)).to.be.true;
    });

    it('should produce the correct trace', () => {
      expect(simulate(petriNet1, {endOnAcceptingState: true})).to.deep.equal({
        exitReason: 'acceptingStateReached',
        trace: {
          events: [
            {
              name: 't1',
              meta: {},
            },
          ]}
        });
    });

    it('should produce the correct trace', () => {
      expect(simulateWithEngine(petriNet1, {endOnAcceptingState: true}, petriNetEngine)).to.deep.equal({
        exitReason: 'acceptingStateReached',
        trace: {
          events: [
            {
              name: 't1',
              meta: {},
            },
          ]}
        });
    });

    it('should produce the correct trace', () => {
      expect(simulate(petriNet1, {endOnAcceptingState: false})).to.deep.equal({
        exitReason: 'noEnabledActivities',
        trace: {
          events: [
            {
              name: 't1',
              meta: {},
            },
          ]}
        });
    });

    it('should produce the correct trace', () => {
      expect(simulateWithEngine(petriNet1, {endOnAcceptingState: false}, petriNetEngine)).to.deep.equal({
        exitReason: 'noEnabledActivities',
        trace: {
          events: [
            {
              name: 't1',
              meta: {},
            },
          ]}
        });
    });

    it('should produce the correct trace', () => {
      expect(simulate(petriNet1, {maxEvents: 0})).to.deep.equal({
        exitReason: 'maxStepsReached',
        trace: {
          events: []}
        });
    });

    it('should produce the correct trace', () => {
      expect(simulateWithEngine(petriNet1, {maxEvents: 0}, petriNetEngine)).to.deep.equal({
        exitReason: 'maxStepsReached',
        trace: {
          events: []}
        });
    });

    it('should produce the correct trace', () => {
      expect(simulate(petriNet1, {maxEvents: 1})).to.deep.equal({
        exitReason: 'maxStepsReached',
        trace: {
          events: [
            {
              name: 't1',
              meta: {},
            },
          ]}
        });
    });
  });

  describe('Petri Net 2', () => {
    it('should be accepting after one transition', () => {
      const initialState = petriNetEngine.resetActivity(petriNet2);
      expect(petriNetEngine.isAccepting(petriNet1, initialState)).to.be.false;
      const nextState = petriNetEngine.executeActivity(petriNet2, initialState, 't1');
      expect(petriNetEngine.isAccepting(petriNet1, nextState)).to.be.true;
    });

    it('should produce the correct trace', () => {
      expect(simulate(petriNet2, {endOnAcceptingState: true})).to.deep.equal({
        exitReason: 'acceptingStateReached',
        trace: {
          events: [
            {
              name: 't1',
              meta: {},
            },
          ]}
        });
    });

    it('should produce the correct trace', () => {
      expect(simulate(petriNet2, {endOnAcceptingState: false})).to.deep.equal({
        exitReason: 'noEnabledActivities',
        trace: {
          events: [
            {
              name: 't1',
              meta: {},
            },
          ]}
        });
    });

    it('should produce the correct trace', () => {
      expect(simulateWithEngine(petriNet2, {maxEvents: 0}, petriNetEngine)).to.deep.equal({
        exitReason: 'maxStepsReached',
        trace: {
          events: []}
        });
    });

    it('should produce the correct trace', () => {
      expect(simulate(petriNet2, {maxEvents: 0})).to.deep.equal({
        exitReason: 'maxStepsReached',
        trace: {
          events: []}
        });
    });

    it('should produce the correct trace', () => {
      expect(simulate(petriNet2, {maxEvents: 1})).to.deep.equal({
        exitReason: 'maxStepsReached',
        trace: {
          events: [
            {
              name: 't1',
              meta: {},
            },
          ]}
        });
    });
  });

  describe('Flow Chart 1', () => {
    it('should not work with the petri net process engine', () => {
      expect(() => simulateWithEngine(flowchart1, {}, petriNetEngine)).to.throw()
    })
  })
})