import { faker } from '@faker-js/faker'
import { Awareness } from 'y-protocols/awareness'
import { WebrtcProvider } from 'y-webrtc'
import { StateCreator } from 'zustand'
import { AwarenessState, EditorState } from './flowStore'
import { yDoc, yDocState } from './yDoc'

export type YjsSlice = {
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
}

export const createYjsSlice: StateCreator<EditorState, [], [], YjsSlice> = (
  set,
  get,
  api
) => ({
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
      api.setState({
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
