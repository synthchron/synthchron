import { Node, Edge } from 'reactflow'
import { Doc } from 'yjs'

export const yDoc = new Doc()
export const yDocState = {
  nodesMap: yDoc.getMap<Node>('nodes'),
  edgesMap: yDoc.getMap<Edge>('edges'),
  metaMap: yDoc.getMap('meta'),
  processModelType: yDoc.getText('processModelType'),
}
