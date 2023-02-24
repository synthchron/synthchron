import { Doc } from 'yjs';
// For this example we use the WebrtcProvider to synchronize the document
// between multiple clients. Other providers are available.
// You can find a list here: https://docs.yjs.dev/ecosystem/connection-provider
import { WebsocketProvider } from 'y-websocket';
import { WebrtcProvider } from 'y-webrtc';


const ydoc = new Doc();
const wsProvider = new WebrtcProvider('my-roomname', ydoc, {
    signaling: ['wss://94.16.117.1/']
})

export default ydoc;