import {
  Connection,
  Edge,
  Node,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from 'reactflow'
import { StateCreator } from 'zustand'

import { GetElementType } from '../processModels/FlowUtil'
import { EditorState } from './flowStore'
import { onEdgesChange } from './onEdgesChange'
import { onNodesChanges } from './onNodesChange'
import { yDocState } from './yDoc'

const getNodeFromLabel = (nodes: Node[], label: string) => {
  return nodes.find((node) => node.id == label)
}

export type FlowSlice = {
  selectedElement: Node | Edge | undefined
  selectElement: (elem: Node | Edge | undefined) => void
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
}

export const createFlowSlice: StateCreator<EditorState, [], [], FlowSlice> = (
  _set,
  get
) => ({
  selectedElement: undefined,
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
  selectElement: (elem: Node | Edge | undefined) => {
    _set({
      selectedElement: elem,
    })
    if (elem) {
      const elemType = GetElementType(elem.type)
      if (elemType == 'node') {
        const updatedNode = yDocState.nodesMap.get(elem.id) as Node
        if (updatedNode) {
          //Element is a node
          yDocState.nodesMap.set(elem.id, {
            ...updatedNode,
            data: {
              ...elem.data,
            },
            id: elem.id,
          })
        }
      } else if (elemType == 'edge') {
        const updatedEdge = yDocState.edgesMap.get(elem.id) as Edge
        if (updatedEdge) {
          //Element is an edge
          yDocState.edgesMap.set(elem.id, {
            ...updatedEdge,
            data: {
              ...elem.data,
            },
            id: elem.id,
          })
        }
      }
    }
  },
})
