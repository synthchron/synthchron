import { Doc } from 'yjs';
// For this example we use the WebrtcProvider to synchronize the document
// between multiple clients. Other providers are available.
// You can find a list here: https://docs.yjs.dev/ecosystem/connection-provider
import { WebsocketProvider } from 'y-websocket';

const ydoc = new Doc();
const wsProvider = new WebsocketProvider('ws://eager-cows-feel-130-225-188-129.loca.lt/', 'my-roomname', ydoc)

export default ydoc;