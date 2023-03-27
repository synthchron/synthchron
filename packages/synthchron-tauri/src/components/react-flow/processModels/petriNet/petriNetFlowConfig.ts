import { ProcessModel, ProcessModelType } from '@synthchron/simulator'
import {
  PetriNetProcessModel,
  PetriNetPlace,
  PetriNetNode,
  PetriNetTransition,
} from '@synthchron/simulator/src/types/processModelTypes/petriNetTypes'
import {
  Connection,
  Edge,
  EdgeTypes,
  MarkerType,
  Node,
  NodeTypes,
} from 'reactflow'
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
  node.type === 'place'

export const petriNetFlowConfig: ProcessModelFlowConfig = {
  processModelType: ProcessModelType.PetriNet,
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
      position: (node as PetriNetNode).position ?? {
        x: Math.random() * 500 - 250,
        y: Math.random() * 500 - 250,
      },
      data: {
        label: node.name,
        store: isPlaceNode(node) ? node.amountOfTokens : node.weight,
        accepting: (node as any).accepting,
      },
    })),
    edges: (processModel as PetriNetProcessModel).edges.map((edge) => ({
      id: `e${edge.source}-${edge.target}`,
      type: 'Arc',
      source: edge.source,
      target: edge.target,
      sourceHandle: 'left',
      targetHandle: 'left',
      markerEnd: { type: MarkerType.ArrowClosed },
      data: { weight: edge.multiplicity },
    })),
  }),
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
          position: node.position,
        } as PetriNetPlace
      } else {
        return {
          identifier,
          type,
          weight: node.data.store,
          name,
          position: node.position,
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
      type: ProcessModelType.PetriNet,
      nodes: simulatorNodes,
      edges: simulatorEdges,
    }
  },
}
