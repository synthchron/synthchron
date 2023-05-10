import { Edge, Node } from 'reactflow'
import { StateCreator } from 'zustand'

import { Configuration } from '@synthchron/simulator'

import { petriNetFlowConfig } from '../processModels/petriNet/petriNetFlowConfig'
import { ProcessModelFlowConfig } from '../processModels/processModelFlowConfig'
import { defaultConfiguration } from '../rightSidebar/SimulationConfiguration'
import { EditorState } from './flowStore'
import { yDocState } from './yDoc'

export type ModelSlice = {
  nodes: Node[]
  edges: Edge[]
  meta: object // Meta information for the model, such as starting node for flowcharts or accepting states for Petri nets
  setMeta: (meta: object) => void
  processModelFlowConfig: ProcessModelFlowConfig
  addNode: (node: Node) => void
  config: Configuration
  setConfig: (newConfig: Configuration) => void
}

export const createModelSlice: StateCreator<EditorState, [], [], ModelSlice> = (
  set
) => ({
  config: defaultConfiguration,
  nodes: Array.from(yDocState.nodesMap.values()),
  edges: Array.from(yDocState.edgesMap.values()),
  meta: Object.fromEntries(yDocState.metaMap.entries()),
  setMeta: (meta: object) => {
    for (const [key, value] of Object.entries(meta)) {
      yDocState.metaMap.set(key, value)
    }
  },
  processModelFlowConfig: petriNetFlowConfig, // TODO: Add switch on process model type from ydoc
  addNode: (node: Node) => {
    const TypeLetterID = node.type === 'Place' ? 'p' : 't'
    // Get new node id
    const newId =
      TypeLetterID +
      (Math.max(
        0,
        ...Array.from(yDocState.nodesMap.values())
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
    yDocState.nodesMap.set(newId.toString(), {
      ...node,
      id: `${newId}`,
    })
  },
  setConfig: (newConfig: Configuration) => {
    set({ config: newConfig })
  },
})
