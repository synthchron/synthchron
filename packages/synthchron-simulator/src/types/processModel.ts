import { DcrGraphProcessModel } from './processModelTypes/dcrGraphTypes'
import { FlowchartProcessModel } from './processModelTypes/flowChart'
import { PetriNetProcessModel } from './processModelTypes/petriNetTypes'

export type ProcessModel =
  | PetriNetProcessModel
  | DcrGraphProcessModel
  | FlowchartProcessModel
