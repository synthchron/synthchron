import { create } from 'zustand'
import {
  Connection,
  Edge,
  Node,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from 'reactflow'

import { ProcessModelFlowConfig } from '../processModels/processModelFlowConfig'
import { petriNetFlowConfig } from '../processModels/petriNet/petriNetFlowConfig'
import { Doc } from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { onNodesChanges } from './onNodesChange'
import { onEdgesChange } from './onEdgesChange'

export type RFState = {
  // YDoc state for collaboration
  yWebRTCProvider: WebrtcProvider | null
  connectRoom: (room: string, keepChanges: boolean) => void
  disconnectRoom: () => void
  // React Flow state
  nodes: Node[]
  edges: Edge[]
  processModelFlowConfig: ProcessModelFlowConfig
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  addNode: (node: Node) => void
  initializeFlow: (
    nodes: Node[],
    edges: Edge[],
    config: ProcessModelFlowConfig
  ) => void
}

const getNodeFromLabel = (nodes: Node[], label: string) => {
  return nodes.find((node) => node.id == label)
}

export const yDoc = new Doc()
export const yDocState = {
  nodesMap: yDoc.getMap<Node>('nodes'),
  edgesMap: yDoc.getMap<Edge>('edges'),
  processModelType: yDoc.getText('processModelType'),
}

// this is our useStore hook that we can use in our components to get parts of the store and call actions
export const useFlowStore = create<RFState>((set, get) => ({
  // YDoc state for collaboration
  yWebRTCProvider: null,
  connectRoom: (_room: string, keepChanges = true) => {
    get().yWebRTCProvider?.disconnect()
    if (!keepChanges) {
      yDoc.destroy()
    }
    const webrtcProvider = new WebrtcProvider(_room, yDoc, {
      signaling: ['wss://94.16.117.1:4444/'],
      peerOpts: {
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
            {
              urls: 'turn:94.16.117.1:3478',
              username: 'blue',
              credential: 'sunflower',
            },
          ],
        },
      },
    })
    set({
      yWebRTCProvider: webrtcProvider,
    })
  },
  disconnectRoom: () => {
    get().yWebRTCProvider?.disconnect()
    set({
      yWebRTCProvider: null,
    })
  },
  // React Flow state
  nodes: Array.from(yDocState.nodesMap.values()),
  edges: Array.from(yDocState.edgesMap.values()),
  processModelFlowConfig: petriNetFlowConfig, // TODO: Add switch on process model type from ydoc
  // React Flow actions
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

    const { source, sourceHandle, target, targetHandle } = connection
    const id = `edge-${source}${sourceHandle || ''}-${target}${
      targetHandle || ''
    }`
    yDocState.edgesMap.set(id, {
      id,
      ...connection,
    } as Edge)
  },
  addNode: (node: Node) => {
    yDocState.nodesMap.set(node.id, node)
  },
  initializeFlow: (
    nodes: Node[],
    edges: Edge[],
    config: ProcessModelFlowConfig
  ) => {
    yDoc.destroy()
    nodes.forEach((node) => {
      yDocState.nodesMap.set(node.id, node)
    })
    edges.forEach((edge) => {
      yDocState.edgesMap.set(edge.id, edge)
    })
    yDocState.processModelType.insert(0, config.processModelType)
  },
}))

const nodeObserver = () => {
  const nodes = Array.from(yDocState.nodesMap.values())
  useFlowStore.setState({
    nodes,
  })
}
yDocState.nodesMap.observe(nodeObserver)
const edgeObserver = () => {
  const edges = Array.from(yDocState.edgesMap.values())
  useFlowStore.setState({
    edges,
  })
}
yDocState.edgesMap.observe(edgeObserver)
const processModelTypeObserver = () => {
  const processModelType = yDocState.processModelType.toString()
  switch (processModelType) {
    case 'petriNet':
      useFlowStore.setState({
        processModelFlowConfig: petriNetFlowConfig,
      })
      break
    default:
      break
  }
}
yDocState.processModelType.observe(processModelTypeObserver)
