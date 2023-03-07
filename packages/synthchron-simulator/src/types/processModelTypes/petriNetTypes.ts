export interface PetriNetProcessModel {
  type: 'petri-net'
  nodes: PetriNetNode[]
  edges: PetriNetEdge[]
}

export interface PetriNetPlace {
  type: 'place'
  identifier: string
  name: string
  accepting: (numOfTokens: number) => boolean
  amountOfTokens: number
}

export interface PetriNetTransition {
  type: 'transition'
  identifier: string
  weight: number
  name: string
}

export type PetriNetNode = PetriNetPlace | PetriNetTransition

export interface PetriNetEdge {
  multiplicity: number
  source: string
  target: string
}
