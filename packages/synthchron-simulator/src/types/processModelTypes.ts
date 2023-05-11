import { DcrGraphProcessModel } from './processModelTypes/dcrGraphTypes'
import { FlowchartProcessModel } from './processModelTypes/flowChart'
import { PetriNetProcessModel } from './processModelTypes/petriNetTypes'

export type ProcessModel = AbstractProcessModel &
  (PetriNetProcessModel | DcrGraphProcessModel | FlowchartProcessModel)

export type AbstractProcessModel = {
  type: ProcessModelType
  nodes: AbstractNode[]
  edges: AbstractEdge[]
  viewPort?: { x: number; y: number; zoom: number }
}

export type AbstractNode = {
  identifier: string
  position?: Point
}

export type AbstractEdge = {
  source: string
  target: string
}

export enum ProcessModelType {
  PetriNet = 'petri-net',
  DcrGraph = 'dcr-graph',
  Flowchart = 'flowchart',
}

export type Point = {
  x: number
  y: number
}
