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

const getNodeFromLabel = (nodes: Node[], label: string) => {
  return nodes.find((node) => node.id == label)
}

export type FlowSlice = {
  selectedElement: Node | Edge | undefined
  selectElement: (elem: Node | Edge | undefined) => void
  changeSelectedPlaceLabel: (newLabel: string, oldLabel: string) => boolean
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
}

export const createFlowSlice: StateCreator<EditorState, [], [], FlowSlice> = (
  set,
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
    get().yEdgesMap.set(id, {
      id,
      ...modelSpecificConnection,
    } as Edge)
  },
  selectElement: (elem: Node | Edge | undefined) => {
    const nodesMap = get().yNodesMap
    const edgesMap = get().yEdgesMap
    set({
      selectedElement: elem,
    })
    if (elem) {
      const elemType = GetElementType(elem.type)
      if (elemType == 'node') {
        const updatedNode = nodesMap.get(elem.id) as Node
        if (updatedNode) {
          //Element is a node
          nodesMap.set(elem.id, {
            ...updatedNode,
            data: {
              ...elem.data,
            },
          })
        }
      } else if (elemType == 'edge') {
        const updatedEdge = edgesMap.get(elem.id) as Edge
        if (updatedEdge) {
          //Element is an edge
          edgesMap.set(elem.id, {
            ...updatedEdge,
            data: {
              ...elem.data,
            },
          })
        }
      }
    }
  },
  changeSelectedPlaceLabel: (newLabel: string, oldLabel: string) => {
    if (newLabel === oldLabel) {
      return true
    }

    const nodesMap = get().yNodesMap
    const labelAvailable = !Array.from(nodesMap.values())
      .filter((node) => node.type === 'Place') //Allows transitions and places to share labels
      .some((node) => node.data.label === newLabel)
    const selectedElem = get().selectedElement

    if (labelAvailable && selectedElem) {
      selectedElem.data.label = newLabel
      if (selectedElem.type === 'Place') {
        nodesMap.set(selectedElem.id, {
          ...(selectedElem as Node),
          data: {
            ...selectedElem.data,
            label: newLabel,
          },
        })
      } else if (selectedElem.type === 'edge') {
        const edge = selectedElem as Edge
        get().yEdgesMap.set(edge.id, {
          ...edge,
          data: {
            ...edge.data,
            label: newLabel,
          },
        })
      } else {
        console.error(
          'Selected element is not a node or an edge',
          selectedElem.type
        )
      }
      get().selectElement({
        ...selectedElem,
      })

      return true
    }
    return false
  },
})
