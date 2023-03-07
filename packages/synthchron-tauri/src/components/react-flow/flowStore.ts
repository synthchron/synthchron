import { create } from 'zustand'
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow'

import { initialNodes, initialEdges } from './inititalData'
import { ProcessModelFlowConfig } from './processModels/processModelFlowConfig'
import { petriNetFlowConfig } from './processModels/petriNet/petriNetFlowConfig'

export type RFState = {
  nodes: Node[]
  edges: Edge[]
  processModelFlowConfig: ProcessModelFlowConfig
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  addNode: (node: Node) => void
}

const getNodeFromLabel = (nodes: Node[], label: string) => {
  return nodes.find((node) => node.id == label)
}

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  processModelFlowConfig: petriNetFlowConfig,
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    })
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    })
  },
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

    set({
      edges: addEdge(modelSpecificConnection, get().edges),
    })
  },
  addNode: (node: Node) => {
    set({
      nodes: [...get().nodes, node],
    })
  },
}))

export default useStore
