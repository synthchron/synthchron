import { WebrtcProvider } from 'y-webrtc'
import { Doc } from 'yjs'

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export const checkRoomIsEmpty = async (room: string) => {
  // TOOD

  const tempYDoc = new Doc()

  const tempWebrtcProvider = new WebrtcProvider(room, tempYDoc, {
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

  await delay(1000)

  const isEmpty = tempWebrtcProvider.awareness.getStates().size <= 1

  tempWebrtcProvider.destroy()

  return isEmpty
}
