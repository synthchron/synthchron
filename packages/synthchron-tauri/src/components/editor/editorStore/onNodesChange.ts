import {
  NodeAddChange,
  NodeChange,
  NodeResetChange,
  OnNodesChange,
  applyNodeChanges,
  getConnectedEdges,
} from 'reactflow'

import { yDocState } from './yDoc'

const isNodeAddChange = (change: NodeChange): change is NodeAddChange =>
  change.type === 'add'
const isNodeResetChange = (change: NodeChange): change is NodeResetChange =>
  change.type === 'reset'

export const onNodesChanges: OnNodesChange = (changes) => {
  const nodes = Array.from(yDocState.nodesMap.values())

  const nextNodes = applyNodeChanges(changes, nodes)
  changes.forEach((change: NodeChange) => {
    if (!isNodeAddChange(change) && !isNodeResetChange(change)) {
      const node = nextNodes.find((n) => n.id === change.id)

      if (node && change.type !== 'remove') {
        yDocState.nodesMap.set(change.id, node)
      } else if (change.type === 'remove') {
        const deletedNode = yDocState.nodesMap.get(change.id)
        yDocState.nodesMap.delete(change.id)
        // when a node is removed, we also need to remove the connected edges
        const edges = Array.from(yDocState.edgesMap.values()).map((e) => e)
        const connectedEdges = getConnectedEdges(
          deletedNode ? [deletedNode] : [],
          edges
        )
        connectedEdges.forEach((edge) => yDocState.edgesMap.delete(edge.id))
      }
    }
  })
}
