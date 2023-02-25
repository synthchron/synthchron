import { Doc } from 'yjs';
// For this example we use the WebrtcProvider to synchronize the document
// between multiple clients. Other providers are available.
// You can find a list here: https://docs.yjs.dev/ecosystem/connection-provider
import { WebrtcProvider } from 'y-webrtc';

localStorage.log = 'true'
const ydoc = new Doc();
const wsProvider = new WebrtcProvider('my-roomname-142', ydoc, {
    signaling: ['ws://94.16.117.1:4444/'],
    peerOpts: {
        config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }, { urls: 'turn:94.16.117.1:3478' }] },

    }
})

export default ydoc;
