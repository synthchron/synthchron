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

import { useEditorStore } from './flowStore'

const isEdgeAddChange = (change: EdgeChange): change is EdgeAddChange =>
  change.type === 'add'
const isEdgeResetChange = (change: EdgeChange): change is EdgeResetChange =>
  change.type === 'reset'
const isEdgeRemoveChange = (change: EdgeChange): change is EdgeRemoveChange =>
  change.type === 'remove'

export const onEdgesChange: OnEdgesChange = (changes) => {
  const edgesMap = useEditorStore.getState().yEdgesMap
  const currentEdges = Array.from(edgesMap.values()).filter((e) => e)
  const nextEdges = applyEdgeChanges(changes, currentEdges)
  changes.forEach((change: EdgeChange) => {
    if (isEdgeRemoveChange(change)) {
      edgesMap.delete(change.id)
    } else if (!isEdgeAddChange(change) && !isEdgeResetChange(change)) {
      const edge = nextEdges.find((n) => n.id === change.id) as Edge
      edgesMap.set(change.id, edge)
    }
  })
}

export const onConnect = (params: Connection | Edge) => {
  const { source, sourceHandle, target, targetHandle } = params
  const id = `edge-${source}${sourceHandle || ''}-${target}${
    targetHandle || ''
  }`

  const edgesMap = useEditorStore.getState().yEdgesMap
  edgesMap.set(id, {
    id,
    ...params,
  } as Edge)
}
