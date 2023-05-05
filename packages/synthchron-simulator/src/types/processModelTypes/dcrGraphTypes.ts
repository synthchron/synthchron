import {
  AbstractEdge,
  AbstractNode,
  ProcessModelType,
} from '../processModelTypes'

export interface DcrGraphProcessModel {
  type: ProcessModelType.DcrGraph
  nodes: DcrGraphNode[]
  edges: DcrGraphEdge[]
}

export type DcrGraphNode = AbstractNode & {
  label: string
  included: boolean
  pending: boolean
  executed: boolean
  weight: number
}

export type DcrGraphEdge = AbstractEdge & {
  type:
    | 'condition'
    | 'exclude'
    | 'include'
    | 'response'
    | 'milestone'
    | 'no-response'
    | 'spawn'
    | 'precondition'
    | 'logical-inclusion'
}
