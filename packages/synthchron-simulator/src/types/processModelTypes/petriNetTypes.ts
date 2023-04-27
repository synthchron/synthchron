import { PositionalNode, ProcessModelType } from '../processModel'

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

export interface PetriNetPlace {
  type: 'place'
  identifier: string
  name: string
  amountOfTokens: number
}

export interface PetriNetTransition {
  type: 'transition'
  identifier: string
  weight: number
  name: string
}

export type PetriNetNode = PositionalNode & (PetriNetPlace | PetriNetTransition)

export interface PetriNetEdge {
  multiplicity: number
  source: string
  target: string
}
