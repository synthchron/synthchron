import { ProcessModelType } from '../processModel'

export interface FlowchartProcessModel {
  type: ProcessModelType.Flowchart
  nodes: FlowchartNode[]
  edges: FlowchartEdge[]
  initialNode: string
}

export interface FlowchartNode {
  type: 'terminal' | 'decision'
  identifier: string
  name?: string
}

export interface FlowchartEdge {
  source: string
  target: string
  weight: number
  name?: string
}
