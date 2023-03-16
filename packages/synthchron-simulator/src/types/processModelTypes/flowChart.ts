import {
  AbstractEdge,
  AbstractNode,
  AbstractProcessModel,
} from '../processModelTypes'

export type FlowchartProcessModel = AbstractProcessModel & {
  type: 'flowchart'
  nodes: FlowchartNode[]
  edges: FlowchartEdge[]
  initialNode: string
}

export type FlowchartNode = AbstractNode & {
  type: 'terminal' | 'decision'
  identifier: string
  name?: string
}

export type FlowchartEdge = AbstractEdge & {
  source: string
  target: string
  weight: number
  name?: string
}
