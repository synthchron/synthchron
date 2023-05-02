import {
  Connection,
  Edge,
  EdgeAddChange,
  EdgeChange,
  EdgeRemoveChange,
  EdgeResetChange,
  OnEdgesChange,
  applyEdgeChanges,
} from 'reactflow'

import { yDocState } from './yDoc'

const isEdgeAddChange = (change: EdgeChange): change is EdgeAddChange =>
  change.type === 'add'
const isEdgeResetChange = (change: EdgeChange): change is EdgeResetChange =>
  change.type === 'reset'
const isEdgeRemoveChange = (change: EdgeChange): change is EdgeRemoveChange =>
  change.type === 'remove'

export const onEdgesChange: OnEdgesChange = (changes) => {
  const currentEdges = Array.from(yDocState.edgesMap.values()).filter((e) => e)
  const nextEdges = applyEdgeChanges(changes, currentEdges)
  changes.forEach((change: EdgeChange) => {
    if (isEdgeRemoveChange(change)) {
      yDocState.edgesMap.delete(change.id)
    } else if (!isEdgeAddChange(change) && !isEdgeResetChange(change)) {
      const edge = nextEdges.find((n) => n.id === change.id) as Edge
      yDocState.edgesMap.set(change.id, edge)
    }
  })
}

export const onConnect = (params: Connection | Edge) => {
  const { source, sourceHandle, target, targetHandle } = params
  const id = `edge-${source}${sourceHandle || ''}-${target}${
    targetHandle || ''
  }`

  yDocState.edgesMap.set(id, {
    id,
    ...params,
  } as Edge)
}
