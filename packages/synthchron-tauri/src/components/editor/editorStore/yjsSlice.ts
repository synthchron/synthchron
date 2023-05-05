import { faker } from '@faker-js/faker'
import { Edge, Node } from 'reactflow'
import { Awareness } from 'y-protocols/awareness'
import { WebrtcProvider } from 'y-webrtc'
import { Doc, Map as YMap, Text as YText } from 'yjs'
import { StateCreator } from 'zustand'

import { petriNetFlowConfig } from '../processModels/petriNet/petriNetFlowConfig'
import { AwarenessState, EditorState } from './flowStore'

export type YjsSlice = {
  yDoc: Doc
  yWebRTCProvider: WebrtcProvider | null
  resetState: () => void

  // State
  yNodesMap: YMap<Node>
  yEdgesMap: YMap<Edge>
  yMetaMap: YMap<unknown>
  yProcessModelType: YText

  // Awareness (cursors, etc.)
  awareness: Awareness | null
  collaboratorStates: Map<
    number,
    {
      [x: string]: AwarenessState
    }
  >
  awarenessState: AwarenessState
  setAwarenessState: (state: Partial<AwarenessState>) => void

  // Connection
  connectRoom: (room: string, keepChanges: boolean) => void
  disconnectRoom: () => void
}

const initialYDoc = new Doc()

export const createYjsSlice: StateCreator<EditorState, [], [], YjsSlice> = (
  set,
  get
) => ({
  yDoc: initialYDoc,
  yWebRTCProvider: null,
  resetState: async () => {
    get().yWebRTCProvider?.destroy()
    get().disconnectRoom()

    const yDoc = new Doc()
    const nodesMap = yDoc.getMap<Node>('nodes')
    const edgesMap = yDoc.getMap<Edge>('edges')
    const metaMap = yDoc.getMap('meta')
    const processModelType = yDoc.getText('processModelType')

    const nodeObserver = () => {
      const nodes = Array.from(nodesMap.values())
      set({
        nodes,
      })
    }
    nodesMap.observe(nodeObserver)

    const edgeObserver = () => {
      const edges = Array.from(edgesMap.values())
      set({
        edges,
      })
    }
    edgesMap.observe(edgeObserver)

    const metaObserver = () => {
      const meta = Object.fromEntries(metaMap.entries())
      set({
        meta,
      })
    }
    metaMap.observe(metaObserver)

    const processModelTypeObserver = () => {
      switch (processModelType.toString()) {
        case 'petriNet':
          set({
            processModelFlowConfig: petriNetFlowConfig,
          })
          break
        default:
          break
      }
    }
    processModelType.observe(processModelTypeObserver)

    set({
      yDoc,
      yNodesMap: nodesMap,
      yEdgesMap: edgesMap,
      yMetaMap: metaMap,
      yProcessModelType: processModelType,
      yWebRTCProvider: null,
    })
  },

  // State
  yNodesMap: initialYDoc.getMap<Node>('nodes'),
  yEdgesMap: initialYDoc.getMap<Edge>('edges'),
  yMetaMap: initialYDoc.getMap('meta'),
  yProcessModelType: initialYDoc.getText('processModelType'),

  connectRoom: async (room: string, keepChanges = true) => {
    get().yWebRTCProvider?.destroy()
    if (!keepChanges) {
      await get().resetState()
    }
    const webrtcProvider = new WebrtcProvider(room, get().yDoc, {
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
      set({
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
})
