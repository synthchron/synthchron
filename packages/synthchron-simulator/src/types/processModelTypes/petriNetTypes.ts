import {
  AbstractEdge,
  AbstractNode,
  ProcessModelType,
} from '../processModelTypes'

export interface PetriNetProcessModel {
  type: ProcessModelType.PetriNet
  acceptingExpressions: AcceptingExpression[]
  nodes: PetriNetNode[]
  edges: PetriNetEdge[]
}

export type AcceptingExpression = {
  name: string
  expression: string
}

export type PetriNetPlace = AbstractNode & {
  type: 'place'
  name: string
  amountOfTokens: number
}

export type PetriNetTransition = AbstractNode & {
  type: 'transition'
  name: string
  weight: number
}

export type PetriNetNode = AbstractNode & (PetriNetPlace | PetriNetTransition)

export type PetriNetEdge = AbstractEdge & {
  multiplicity: number
}
