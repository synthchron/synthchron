import { Edge, Node } from 'reactflow'
import { StateCreator } from 'zustand'

import { Configuration } from '@synthchron/simulator'

import { petriNetFlowConfig } from '../processModels/petriNet/petriNetFlowConfig'
import { ProcessModelFlowConfig } from '../processModels/processModelFlowConfig'
import { defaultConfiguration } from '../rightSidebar/SimulationConfiguration'
import { EditorState } from './flowStore'

export type ModelSlice = {
  nodes: Node[]
  edges: Edge[]
  meta: object // Meta information for the model, such as starting node for flowcharts or accepting states for Petri nets
  setMeta: (meta: object) => void
  processModelFlowConfig: ProcessModelFlowConfig
  addNode: (node: Node) => void
}

export const createModelSlice: StateCreator<EditorState, [], [], ModelSlice> = (
  set,
  get
) => ({
  config: defaultConfiguration,
  nodes: [],
  edges: [],
  meta: {},
  setMeta: (meta: object) => {
    for (const [key, value] of Object.entries(meta)) {
      get().yMetaMap.set(key, value)
    }
  },
  processModelFlowConfig: petriNetFlowConfig, // TODO: Add switch on process model type from ydoc
  addNode: (node: Node) => {
    const TypeLetterID = node.type === 'Place' ? 'p' : 't'
    const nodesMap = get().yNodesMap
    // Get new node id
    const newId =
      TypeLetterID +
      (Math.max(
        0,
        ...Array.from(nodesMap.values())
          .map((node) =>
            parseInt(
              //Differentiate between places and transitions, so place ids are in order
              node.id.charAt(0) === TypeLetterID
                ? node.id.substring(1)
                : node.id
            )
          )
          .filter((id) => !isNaN(id))
      ) +
        1)
    nodesMap.set(newId.toString(), {
      ...node,
      id: `${newId}`,
    })
  },
  setConfig: (newConfig: Configuration) => {
    set({ config: newConfig })
  },
})
