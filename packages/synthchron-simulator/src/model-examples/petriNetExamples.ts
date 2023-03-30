import { ProcessModelType } from '../types/processModel'
import { PetriNetProcessModel } from '../types/processModelTypes/petriNetTypes'

// This petri net should simulate as follows:
// ["t1"]
export const petriNet1: PetriNetProcessModel = {
  type: ProcessModelType.PetriNet,
  nodes: [
    {
      type: 'place',
      identifier: 'p1',
      name: 'p1',
      amountOfTokens: 2,
    },
    {
      type: 'place',
      identifier: 'p2',
      name: 'p2',
      amountOfTokens: 0,
    },
    {
      type: 'transition',
      identifier: 't1',
      weight: 1,
      name: 't1',
    },
  ],
  edges: [
    {
      multiplicity: 1,
      source: 'p1',
      target: 't1',
    },
    {
      multiplicity: 1,
      source: 't1',
      target: 'p2',
    },
  ],
  acceptingExpressions: [
    {
      name: 'accepting',
      expression: 'pp1 >= 1 and pp2 >= 1',
    },
  ],
}

// This petri Net should simulate as follows:
// ["t1"]
export const petriNet2: PetriNetProcessModel = {
  type: ProcessModelType.PetriNet,
  nodes: [
    {
      type: 'place',
      identifier: 'p1',
      name: 'p1',
      amountOfTokens: 2,
    },
    {
      type: 'place',
      identifier: 'p2',
      name: 'p2',
      amountOfTokens: 0,
    },
    {
      type: 'place',
      identifier: 'p3',
      name: 'p3',
      amountOfTokens: 0,
    },
    {
      type: 'transition',
      identifier: 't1',
      weight: 1,
      name: 't1',
    },
  ],
  edges: [
    {
      multiplicity: 1,
      source: 'p1',
      target: 't1',
    },
    {
      multiplicity: 1,
      source: 't1',
      target: 'p2',
    },
    {
      multiplicity: 1,
      source: 't1',
      target: 'p3',
    },
  ],
  acceptingExpressions: [
    {
      name: 'accepting',
      expression: 'pp1 >= 1 and pp2 >= 1 and pp3 >= 1',
    },
  ],
}

export const petriNet3: PetriNetProcessModel = {
  type: ProcessModelType.PetriNet,
  nodes: [
    {
      type: 'place',
      identifier: 'p1',
      name: 'p1',
      amountOfTokens: 2,
    },
    {
      type: 'place',
      identifier: 'p2',
      name: 'p2',
      amountOfTokens: 1,
    },
    {
      type: 'transition',
      identifier: 't1',
      weight: 1,
      name: 't1',
    },
  ],
  edges: [
    {
      multiplicity: 1,
      source: 'p1',
      target: 't1',
    },
    {
      multiplicity: 1,
      source: 't1',
      target: 'p2',
    },
  ],
  acceptingExpressions: [
    {
      name: 'accepting',
      expression: 'pp1 mod 2 == 0 and pp2 mod 2 == 1',
    },
  ],
}
