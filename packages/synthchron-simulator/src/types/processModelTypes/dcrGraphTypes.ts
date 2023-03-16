import {
  AbstractEdge,
  AbstractNode,
  AbstractProcessModel,
} from '../processModelTypes'

export type DcrGraphProcessModel = AbstractProcessModel & {
  type: 'dcr-graph'
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
  source: string
  target: string
}
