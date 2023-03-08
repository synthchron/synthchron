import { ProcessModel } from '@synthchron/simulator'
import {
  PetriNetProcessModel,
  PetriNetPlace,
  PetriNetNode,
} from '@synthchron/simulator/src/types/processModelTypes/petriNetTypes'
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

const isPlaceNode = (node: PetriNetNode): node is PetriNetPlace =>
  (node as PetriNetPlace).amountOfTokens !== undefined

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
  generateFlow: (processModel: ProcessModel) => ({
    nodes: (processModel as PetriNetProcessModel).nodes.map((node) => ({
      id: node.identifier,
      type: isPlaceNode(node) ? 'Place' : 'Transition',
      position: {
        x: 0,
        y: 0,
      },
      data: {
        label: node.name,
        store: isPlaceNode(node) ? node.amountOfTokens : undefined,
      },
    })),
    edges: (processModel as PetriNetProcessModel).edges.map((edge) => ({
      id: `e${edge.source}-${edge.target}`,
      type: 'Arc',
      source: edge.source,
      target: edge.target,
      sourceHandle: 'c',
      targetHandle: 'a',
      markerEnd: { type: MarkerType.ArrowClosed },
      data: { weight: edge.multiplicity },
    })),
  }),
}
