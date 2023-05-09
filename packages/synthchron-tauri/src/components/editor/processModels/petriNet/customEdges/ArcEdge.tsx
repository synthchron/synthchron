import { useCallback } from 'react'

import { BaseEdge, EdgeProps, getBezierPath, useStore } from 'reactflow'

import { PetriNetArcData } from '../petriNetTypes'
import { getEdgeParams } from './utils'

const ArcEdge: React.FC<EdgeProps<PetriNetArcData>> = ({
  source,
  target,
  markerEnd,
  data,
}) => {
  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(source), [source])
  )
  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(target), [target])
  )

  if (!sourceNode || !targetNode) {
    return null
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode
  )

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  })

  return (
    <BaseEdge
      path={edgePath}
      labelX={labelX}
      labelY={labelY}
      label={data?.multiplicity}
      labelShowBg={true}
      labelBgStyle={{ fill: '#f7f7f7' }}
      labelStyle={{ fill: 'black' }}
      labelBgBorderRadius={3}
      markerEnd={markerEnd}
      interactionWidth={10} // For larger clickable area
    />
  )
}

export default ArcEdge
