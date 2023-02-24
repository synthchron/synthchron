import { Doc } from 'yjs';
// For this example we use the WebrtcProvider to synchronize the document
// between multiple clients. Other providers are available.
// You can find a list here: https://docs.yjs.dev/ecosystem/connection-provider
import { WebsocketProvider } from 'y-websocket';

const ydoc = new Doc();
const wsProvider = new WebsocketProvider('ws://94.16.117.1/', 'my-roomname', ydoc)

export default ydoc;