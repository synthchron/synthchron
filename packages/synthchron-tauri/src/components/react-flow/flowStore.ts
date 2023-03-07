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
  NodeTypes,
  EdgeTypes,
  MarkerType,
} from 'reactflow'

import {
  initialNodes,
  initialEdges,
  nodeTypes,
  edgeTypes,
} from './inititalData'

export type RFState = {
  nodes: Node[]
  edges: Edge[]
  nodeTypes: NodeTypes
  edgeTypes: EdgeTypes
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
  nodeTypes: nodeTypes,
  edgeTypes: edgeTypes,
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

    // Checking if it is valid connection for a petri net
    // TODO: Extract this somewhere else
    if (sourceNode.type == targetNode.type) {
      return
    }

    set({
      edges: addEdge(
        {
          ...connection,
          type: 'Arc',
          markerEnd: { type: MarkerType.ArrowClosed },
          data: { weight: 1 },
        },
        get().edges
      ),
    })
  },
  addNode: (node: Node) => {
    set({
      nodes: [...get().nodes, node],
    })
  },
}))

export default useStore
