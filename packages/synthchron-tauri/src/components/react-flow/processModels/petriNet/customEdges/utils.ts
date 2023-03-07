/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Position, internalsSymbol, Node } from 'reactflow'

function getClosestHandle(source: Node, target: Node) {
  const targetCenter = getNodeCenter(target)
  const sourceCenter = getNodeCenter(source)

  const targetHandle = target[internalsSymbol]?.handleBounds?.source
    ?.sort(
      (h1, h2) =>
        (h1.x + targetCenter.x - sourceCenter.x) ** 2 +
        (h1.y + targetCenter.y - sourceCenter.y) ** 2 -
        (h2.x + targetCenter.x - sourceCenter.x) ** 2 -
        (h2.y + targetCenter.y - sourceCenter.y) ** 2
    )
    .at(0)

  if (!targetHandle) {
    return [0, 0, Position.Right]
  }

  let offsetX = targetHandle.width / 2
  let offsetY = targetHandle.height / 2

  // this is a tiny detail to make the markerEnd of an edge visible. The handle position that gets calculated has the origin top-left, so depending which side we are using, we add a little offset when the handlePosition is Position.Right for example, we need to add an offset as big as the handle itself in order to get the correct position
  switch (targetHandle.position) {
    case Position.Left:
      offsetX = 0
      break
    case Position.Right:
      offsetX = targetHandle.width
      break
    case Position.Top:
      offsetY = 0
      break
    case Position.Bottom:
      offsetY = targetHandle.height
      break
  }

  return [
    (target.positionAbsolute?.x ?? 0) + targetHandle.x + offsetX,
    (target.positionAbsolute?.y ?? 0) + targetHandle.y + offsetY,
    targetHandle.position,
  ]
}

//@ts-ignore
function getNodeCenter(node) {
  return {
    x: node.positionAbsolute.x + node.width / 2,
    y: node.positionAbsolute.y + node.height / 2,
  }
}

export const getEdgeParams = (source: Node, target: Node) => {
  const [sx, sy, sourcePos] = getClosestHandle(target, source)
  const [tx, ty, targetPos] = getClosestHandle(source, target)

  return {
    sx: sx as number,
    sy: sy as number,
    tx: tx as number,
    ty: ty as number,
    sourcePos: sourcePos as Position,
    targetPos: targetPos as Position,
  }
}
