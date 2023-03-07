import { Connection, EdgeTypes, MarkerType, Node, NodeTypes } from 'reactflow'
import { ProcessModelFlowConfig } from '../processModelFlowConfig'
import ArcEdge from './customEdges/ArcEdge'
import PlaceNode from './customNodes/PlaceNode'
import TransitionNode from './customNodes/TransitionNode'

const nodeTypes: NodeTypes = {
  Place: PlaceNode,
  Transition: TransitionNode,
}

const edgeTypes: EdgeTypes = {
  Arc: ArcEdge,
}

export const petriNetFlowConfig: ProcessModelFlowConfig = {
  nodeTypes: nodeTypes,
  edgeTypes: edgeTypes,
  checkConnect: (
    connection: Connection,
    sourceNode: Node,
    targetNode: Node
  ) => {
    if (sourceNode.type == targetNode.type) {
      return null
    }

    return {
      ...connection,
      type: 'Arc',
      markerEnd: { type: MarkerType.ArrowClosed },
      data: { weight: 1 },
    }
  },
}
