import { DcrGraphProcessModel } from './processModelTypes/dcrGraphTypes'
import { FlowchartProcessModel } from './processModelTypes/flowChart'
import { PetriNetProcessModel } from './processModelTypes/petriNetTypes'

export type ProcessModel =
  | PetriNetProcessModel
  | DcrGraphProcessModel
  | FlowchartProcessModel

export enum ProcessModelType {
  PetriNet = 'petri-net',
  DcrGraph = 'dcr-graph',
  Flowchart = 'flowchart',
}

export type Point = {
  x: number
  y: number
}

export type PositionalNode = {
  position?: Point
}
