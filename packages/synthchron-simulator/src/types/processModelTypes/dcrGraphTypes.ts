import { Point, ProcessModelType } from '../processModel'

export interface DcrGraphProcessModel {
  type: ProcessModelType.DcrGraph
  nodes: DcrGraphNode[]
  edges: DcrGraphEdge[]
}

export type DcrGraphNode = Point & {
  label: string
  included: boolean
  pending: boolean
  executed: boolean
  weight: number
}

export interface DcrGraphEdge {
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
