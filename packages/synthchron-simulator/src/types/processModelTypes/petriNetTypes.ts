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
  x? : number
  y? : number
}

export interface PetriNetTransition {
  type: 'transition'
  identifier: string
  weight: number
  name: string
  x? : number
  y? : number
}

export type PetriNetNode = PetriNetPlace | PetriNetTransition

export interface PetriNetEdge {
  multiplicity: number
  source: string
  target: string
}
