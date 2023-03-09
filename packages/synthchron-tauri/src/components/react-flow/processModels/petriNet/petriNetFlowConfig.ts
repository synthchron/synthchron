import {
  Connection,
  EdgeTypes,
  MarkerType,
  Node,
  Edge,
  NodeTypes,
} from 'reactflow'
import { ProcessModelFlowConfig } from '../processModelFlowConfig'
import ArcEdge from './customEdges/ArcEdge'
import PlaceNode from './customNodes/PlaceNode'
import TransitionNode from './customNodes/TransitionNode'
import { PetriNetTransition } from '@synthchron/simulator'
import { PetriNetPlace } from '@synthchron/simulator'

const nodeTypes: NodeTypes = {
  Place: PlaceNode,
  Transition: TransitionNode,
}

const edgeTypes: EdgeTypes = {
  Arc: ArcEdge,
}

export const petriNetFlowConfig: ProcessModelFlowConfig = {
  processModelType: 'petri-net',
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
  serialize: (nodes: Node[], edges: Edge[]) => {
    const simulatorNodes = nodes.map((node) => {
      const identifier = node.id
      const type: 'place' | 'transition' =
        node.type == 'Place' ? 'place' : 'transition'
      const name = node.data.label

      if (type == 'place') {
        return {
          identifier,
          type,
          name,
          accepting: node.data.accepting,
          amountOfTokens: node.data.store,
        } as PetriNetPlace
      } else {
        return {
          identifier,
          type,
          weight: node.data.store,
          name,
        } as PetriNetTransition
      }
    })

    const simulatorEdges = edges.map((edge) => {
      return {
        source: edge.source,
        target: edge.target,
        multiplicity: edge.data.weight,
      }
    })
    return {
      type: 'petri-net',
      nodes: simulatorNodes,
      edges: simulatorEdges,
    }
  },
}
