// This file contains initial data for the react flow component
// This will be deleted once we implement saving and restoring flows

import { Edge, EdgeTypes, MarkerType, Node, NodeTypes } from 'reactflow'
import ArcEdge from './customEdges/ArcEdge'
import PlaceNode from './customNodes/PlaceNode'
import TransitionNode from './customNodes/TransitionNode'

//Initial nodes and edges
export const initialNodes: Node[] = [
  {
    id: '1',
    type: 'Place',
    position: { x: 0, y: 0 },
    data: { label: '1', store: 9 },
  },
  {
    id: '3',
    type: 'Place',
    position: { x: 700, y: 300 },
    data: { label: '1', store: 0 },
  },
  {
    id: '4',
    type: 'Place',
    position: { x: 500, y: 500 },
    data: { label: 'TEST', store: 0 },
  },
  {
    id: '5',
    type: 'Transition',
    position: { x: 400, y: 300 },
    data: { label: 'TransitionNode', store: 10 },
  },
]

export const initialEdges: Edge[] = [
  {
    id: 'e1-3',
    type: 'Arc',
    source: '1',
    target: '3',
    sourceHandle: 'c',
    targetHandle: 'a',
    markerEnd: { type: MarkerType.ArrowClosed },
    data: { weight: 1 },
  },
]

export const nodeTypes: NodeTypes = {
  Place: PlaceNode,
  Transition: TransitionNode,
}

export const edgeTypes: EdgeTypes = {
  Arc: ArcEdge,
}
