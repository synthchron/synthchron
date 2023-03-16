/**
 * This file contains the types for abstract process models. This includes process models, nodes and edges. The specific process models can be found in the processModelTypes folder.
 */

import { DcrGraphProcessModel } from './processModelTypes/dcrGraphTypes'
import { FlowchartProcessModel } from './processModelTypes/flowChart'
import { PetriNetProcessModel } from './processModelTypes/petriNetTypes'

// A general definition of a process model
export type AbstractProcessModel = {
  type: string
  nodes: AbstractNode[]
  edges: AbstractEdge[]
}

// A general definition of a node
export type AbstractNode = {
  identifier: string
  position?: Point
}

// A general definition of an edge
export type AbstractEdge = {
  source: string
  target: string
}

// A specific definition of all possible process models. Add new process models here.
export type ProcessModel = AbstractProcessModel &
  (PetriNetProcessModel | DcrGraphProcessModel | FlowchartProcessModel)

// -----------------------------------
// Utils

// A point in 2D space
export type Point = {
  x: number
  y: number
}
