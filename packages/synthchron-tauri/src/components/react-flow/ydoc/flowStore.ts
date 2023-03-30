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
import { Awareness } from 'y-protocols/awareness'
import { faker } from '@faker-js/faker'
import { ProcessModel } from '@synthchron/simulator'
import { usePersistentStore } from '../../common/persistentStore'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AwarenessState = any

export type RFState = {
  // YDoc state for collaboration
  yWebRTCProvider: WebrtcProvider | null
  awareness: Awareness | null
  collaboratorStates: Map<
    number,
    {
      [x: string]: AwarenessState
    }
  >
  awarenessState: AwarenessState
  setAwarenessState: (state: Partial<AwarenessState>) => void
  connectRoom: (room: string, keepChanges: boolean) => void
  disconnectRoom: () => void
  // React Flow state
  nodes: Node[]
  edges: Edge[]
  processModelFlowConfig: ProcessModelFlowConfig
  selectedElement: Node | Edge | undefined
  selectElement: (elem: Node | Edge | undefined) => void
  onSelectedElementChange: () => void
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  addNode: (node: Node) => void
  initializeFlow: (
    nodes: Node[],
    edges: Edge[],
    config: ProcessModelFlowConfig
  ) => void
  saveFlow: (id: string) => void
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

/* export const undoManager = new UndoManager([
  yDocState.nodesMap,
  yDocState.edgesMap,
])

undoManager.on('stack-item-added', (event: any) => {
  // save the current cursor location on the stack-item
  console.log('stack-item-added', event)
}) */

// this is our useStore hook that we can use in our components to get parts of the store and call actions
export const useFlowStore = create<RFState>((set, get) => ({
  // YDoc state for collaboration
  yWebRTCProvider: null,
  selectedElement: undefined,
  connectRoom: async (room: string, keepChanges = true) => {
    get().yWebRTCProvider?.destroy()
    if (!keepChanges) {
      yDocState.nodesMap.clear()
      yDocState.edgesMap.clear()
      yDocState.processModelType.delete(0, yDocState.processModelType.length)
    } /* else { // This feature would wait for the document to be loaded before allowing changes, but it might now work at this point
        yDoc.autoLoad = false
        yDoc.shouldLoad = false
      } */
    const webrtcProvider = new WebrtcProvider(room, yDoc, {
      signaling: ['wss://netcup.lenny.codes/signaling/'],
      peerOpts: {
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            //{ urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
            {
              urls: 'turn:94.16.117.1:3478',
              username: 'blue',
              credential: 'sunflower',
            },
          ],
        },
      },
    })
    webrtcProvider.awareness.on('change', () => {
      const allCollaborators = new Map(webrtcProvider.awareness.getStates())
      allCollaborators.delete(webrtcProvider.awareness.clientID)
      useFlowStore.setState({
        collaboratorStates: allCollaborators,
        awarenessState: webrtcProvider.awareness.getLocalState(),
      })
    })

    webrtcProvider.awareness.setLocalStateField('user', {
      name: faker.animal.fish(),
      color: faker.color.rgb(),
    })

    set({
      yWebRTCProvider: webrtcProvider,
      awareness: webrtcProvider.awareness,
    })
  },
  awareness: null,
  collaboratorStates: new Map(),
  awarenessState: {},
  setAwarenessState: (state: Partial<AwarenessState>) => {
    const awareness = get().awareness
    awareness?.setLocalStateField('user', {
      ...awareness?.getLocalState()?.user,
      ...state,
    })
  },
  disconnectRoom: async () => {
    // I have no idea why the 'await' is needed here, but if it is not there, the "collaboratorState" is not deleted properly
    // My IDE says it is redundant. TOOD: Please investigate at some point.
    await get().yWebRTCProvider?.destroy()
    set({
      yWebRTCProvider: null,
      awareness: null,
      collaboratorStates: new Map(),
      awarenessState: {},
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
  addNode: (node: Node) => {
    // Get new node id
    const newId =
      Math.max(
        0,
        ...Array.from(yDocState.nodesMap.values())
          .map((node) => parseInt(node.id))
          .filter((id) => !isNaN(id))
      ) + 1
    console.log(newId)
    yDocState.nodesMap.set(newId.toString(), {
      ...node,
      id: newId.toString(),
    })
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
  saveFlow: (id: string) => {
    const processModel: ProcessModel = get().processModelFlowConfig.serialize(
      get().nodes,
      get().edges
    )
    usePersistentStore.getState().updateProject(id, {
      projectModel: processModel,
    })
  },
  selectElement: (elem: Node | Edge | undefined) => {
    set({
      selectedElement: elem,
    })

    console.log(elem)
    if (elem) {
      if ('position' in elem) {
        //Element is a node
        yDocState.nodesMap.set(elem.id, {
          ...elem,
          id: elem.id,
        })
      } else {
        yDocState.edgesMap.set(elem.id, {
          ...elem,
          id: elem.id,
        })
      }
    }
  },
  onSelectedElementChange: () => {
    console.log('TEST_Should deltetes')
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
