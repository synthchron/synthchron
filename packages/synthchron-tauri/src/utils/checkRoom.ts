import { WebrtcProvider } from 'y-webrtc'
import { Doc } from 'yjs'

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export const checkRoomIsEmpty = async (room: string) => {
  // TOOD

  const tempYDoc = new Doc()

  const tempWebrtcProvider = new WebrtcProvider(room, tempYDoc, {
    signaling: ['wss://ali-signaling-service-basic-eu.azurewebsites.net/'],
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
          {
            urls: 'TURN:freestun.net:3479',
            username: 'free',
            credential: 'free',
          },
        ],
      },
    },
  })

  await delay(60000)

  const isEmpty = tempWebrtcProvider.awareness.getStates().size <= 1

  tempWebrtcProvider.destroy()

  return isEmpty
}
