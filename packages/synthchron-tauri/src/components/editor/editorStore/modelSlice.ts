import { Edge, Node } from 'reactflow'
import { StateCreator } from 'zustand'

import { Configuration } from '@synthchron/types'

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
    const nodesMap = get().yNodesMap
    // Get new node id
    const newId =
      Math.max(
        0,
        ...Array.from(nodesMap.values())
          .map((node) => parseInt(node.id))
          .filter((id) => !isNaN(id))
      ) + 1

    const uniqueLabelNumber =
      Math.max(
        0,
        ...Array.from(nodesMap.values()).map((node) => {
          const strippedLabel = node.data.label && node.data.label.substring(1)
          return strippedLabel &&
            strippedLabel.length > 0 &&
            !isNaN(parseInt(strippedLabel))
            ? parseInt(strippedLabel)
            : 0
        })
      ) + 1
    nodesMap.forEach((node) => {
      if (node.selected) {
        node.selected = false
      }
    })
    nodesMap.set(newId.toString(), {
      ...node,
      id: `${newId}`,
      data: {
        ...node.data,
        label: `${node.data.label}${uniqueLabelNumber}`,
      },
    })
  },
  setConfig: (config: Configuration) => {
    set({ config })
  },
})
