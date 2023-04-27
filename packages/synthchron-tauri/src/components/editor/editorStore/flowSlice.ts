import {
  Connection,
  Edge,
  Node,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from 'reactflow'
import { StateCreator } from 'zustand'

import { EditorState } from './flowStore'
import { onEdgesChange } from './onEdgesChange'
import { onNodesChanges } from './onNodesChange'
import { yDocState } from './yDoc'

const getNodeFromLabel = (nodes: Node[], label: string) => {
  return nodes.find((node) => node.id == label)
}

export type FlowSlice = {
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
}

export const createFlowSlice: StateCreator<EditorState, [], [], FlowSlice> = (
  _set,
  get
) => ({
  onNodesChange: onNodesChanges,
  onEdgesChange: onEdgesChange,
  onConnect: (connection: Connection) => {
    if (connection.source == null || connection.target == null) return

    const sourceNode = getNodeFromLabel(get().nodes, connection.source)
    const targetNode = getNodeFromLabel(get().nodes, connection.target)

    // Checking both nodes exists
    if (sourceNode == undefined || targetNode == undefined) return

    if (
      // Checking if the connection already exists
      get().edges.some(
        (edge) =>
          edge.source == connection.source && edge.target == connection.target
      )
    )
      return

    const modelSpecificConnection = get().processModelFlowConfig.checkConnect(
      connection,
      sourceNode,
      targetNode
    )

    if (modelSpecificConnection == null) return

    const { source, sourceHandle, target, targetHandle } =
      modelSpecificConnection
    const id = `edge-${source}${sourceHandle || ''}-${target}${
      targetHandle || ''
    }`
    yDocState.edgesMap.set(id, {
      id,
      ...modelSpecificConnection,
    } as Edge)
  },
})
