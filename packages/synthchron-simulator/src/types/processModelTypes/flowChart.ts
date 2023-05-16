import {
  AbstractEdge,
  AbstractNode,
  ProcessModelType,
} from '../processModelTypes'

export type FlowchartProcessModel = {
  type: ProcessModelType.Flowchart
  nodes: FlowchartNode[]
  edges: FlowchartEdge[]
  initialNode: string
}

export type FlowchartNode = AbstractNode & {
  type: 'terminal' | 'decision'
  name?: string
}

export type FlowchartEdge = AbstractEdge & {
  weight: number
  name?: string
}
