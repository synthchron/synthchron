import { Node, Edge } from 'reactflow'
import { Doc } from 'yjs'

// This is the only global yDoc used. It is the single source of truth for the whole app.
export const yDoc = new Doc()
export const yDocState = {
  nodesMap: yDoc.getMap<Node>('nodes'),
  edgesMap: yDoc.getMap<Edge>('edges'),
  metaMap: yDoc.getMap('meta'),
  processModelType: yDoc.getText('processModelType'),
}
