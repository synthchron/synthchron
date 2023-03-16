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

export type PetriNetPlace = AbstractNode & {
  type: 'place'
  name: string
  accepting: (numOfTokens: number) => boolean
  amountOfTokens: number
}

export type PetriNetTransition = AbstractNode & {
  type: 'transition'
  weight: number
  name: string
}

export type PetriNetNode = AbstractNode & (PetriNetPlace | PetriNetTransition)

export type PetriNetEdge = AbstractEdge & {
  multiplicity: number
}
