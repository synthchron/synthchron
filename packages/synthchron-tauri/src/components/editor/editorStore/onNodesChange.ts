import {
  NodeAddChange,
  NodeChange,
  NodeResetChange,
  OnNodesChange,
  applyNodeChanges,
  getConnectedEdges,
} from 'reactflow'

import { useEditorStore } from './flowStore'

const isNodeAddChange = (change: NodeChange): change is NodeAddChange =>
  change.type === 'add'
const isNodeResetChange = (change: NodeChange): change is NodeResetChange =>
  change.type === 'reset'

export const onNodesChanges: OnNodesChange = (changes) => {
  const nodesMap = useEditorStore.getState().yNodesMap
  const edgesMap = useEditorStore.getState().yEdgesMap
  const nodes = Array.from(nodesMap.values())

  const nextNodes = applyNodeChanges(changes, nodes)
  changes.forEach((change: NodeChange) => {
    if (!isNodeAddChange(change) && !isNodeResetChange(change)) {
      const node = nextNodes.find((n) => n.id === change.id)

      if (node && change.type !== 'remove') {
        nodesMap.set(change.id, node)
      } else if (change.type === 'remove') {
        const deletedNode = nodesMap.get(change.id)
        nodesMap.delete(change.id)
        // when a node is removed, we also need to remove the connected edges
        const edges = Array.from(edgesMap.values()).map((e) => e)
        const connectedEdges = getConnectedEdges(
          deletedNode ? [deletedNode] : [],
          edges
        )
        connectedEdges.forEach((edge) => edgesMap.delete(edge.id))
      }
    }
  })
}
