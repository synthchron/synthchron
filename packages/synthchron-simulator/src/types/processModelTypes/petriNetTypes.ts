import {
  AbstractEdge,
  AbstractNode,
  AbstractProcessModel,
} from '../processModelTypes'

export type PetriNetProcessModel = AbstractProcessModel & {
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

export type PetriNetNode = AbstractNode & (PetriNetPlace | PetriNetTransition)

export type PetriNetEdge = AbstractEdge & {
  multiplicity: number
  source: string
  target: string
}
