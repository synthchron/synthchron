import { useCallback, useRef, useState } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  ConnectionMode,
  Edge,
  ReactFlowProvider,
  ReactFlowInstance,
  Node,
} from 'reactflow'

// 👇 you need to import the reactflow styles
import 'reactflow/dist/style.css'
import './customNodes/NodeStyle.css'
import './customEdges/EdgeStyle.css'
import './sidebar.css'

// 👇 Importing components
import PlaceNode from './customNodes/PlaceNode'
import TransitionNode from './customNodes/TransitionNode'
import ArcEdge from './customEdges/ArcEdge'
import { Sidebar } from './Sidebar'
import React from 'react'

//Types
const nodeTypes = {
  Place: PlaceNode,
  Transition: TransitionNode,
}
const edgeTypes = {
  Arc: ArcEdge,
}

//Initial nodes and edges
const initialNodes: Node[] = [
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
const initialEdges: Edge[] = [
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

//Drag and drop setup
let id = 0
const dndGetId = () => `dndnode_${id++}`

export default function Flow() {
  //Setting consts
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null)

  //Function for getting a node
  function get_node(nodeId: string) {
    return nodes.find((node) => {
      if (node.id == nodeId) {
        return node
      }
    })
  }

  //Test function for when edges are removed
  function edgeDelTest() {
    console.log('delete')
  }

  //Transfer tokens on double click
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onNodeDoubleClick(params: any, node: any) {
    const fromEdges = edges.filter((edge) => edge.source == node.id)
    const toEdges = edges.filter((edge) => edge.target == node.id)

    if (node.type == 'Transition') {
      const sourceNodesIds = toEdges.map((edge) => edge.source)
      const sourceNodes = nodes.filter((fnodes) =>
        sourceNodesIds.includes(fnodes.id)
      )
      const targetNodesIds = fromEdges.map((edge) => edge.target)
      const targetNodes = nodes.filter((fnodes) =>
        targetNodesIds.includes(fnodes.id)
      )

      if (sourceNodes.every((node) => node.data.store >= 1)) {
        sourceNodes.forEach((node) => {
          node.data = { label: 'Trigg', store: node.data.store - 1 }
        })
        targetNodes.forEach((node) => {
          node.data = { label: 'ered', store: node.data.store + 1 }
        })
      }

      //For updating edges, if for example we wanted to animate edges
      //fromEdges[0].animated = true;
      //let unchangedEdges = edges.filter(edge => !fromEdges.includes(edge) && !toEdges.includes(edge))
      //let changedEdges = fromEdges.concat(toEdges);
      //setEdges(changedEdges.concat(unchangedEdges));

      const unchangedNodes = nodes.filter(
        (node) => !sourceNodes.includes(node) && !targetNodes.includes(node)
      )
      const changedNodes = sourceNodes.concat(targetNodes)
      setNodes(unchangedNodes.concat(changedNodes))
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onConnect(params: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setEdges((eds: Edge<any>[]) => {
      const sourceNode = get_node(params.source)
      const targetNode = get_node(params.target)

      const is_invalid = edges.every((edge) => {
        // checking if another edge already exists
        if (edge.source == params.source && edge.target == params.target)
          return true
        return false
      })

      // returning without the added note if invalid found
      if (is_invalid) {
        return eds
      }

      // Checking both nodes exists
      if (sourceNode == undefined || targetNode == undefined) return eds

      // Checking if it is valid connection for a place node
      if (sourceNode.type == 'Place') {
        if (targetNode.type == 'Place') {
          return eds
        }
      }

      // Checking if it is valid connection for a transition node
      if (sourceNode.type == 'Transition') {
        if (targetNode.type == 'Transition') {
          return eds
        }
      }

      // Add edge to the list of edges
      return addEdge(
        {
          ...params,
          type: 'Arc',
          markerEnd: { type: MarkerType.ArrowClosed },
          data: { weight: 1 },
        },
        eds
      )
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragOver = useCallback((event: any) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onDrop(event: any) {
    event.preventDefault()

    if (reactFlowWrapper.current == null || reactFlowInstance == null) {
      return
    }

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
    const type = event.dataTransfer.getData('application/reactflow')

    // check if the dropped element is valid
    if (typeof type === 'undefined' || !type) {
      return
    }

    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    })
    const newNode = {
      id: dndGetId(),
      type: type,
      position,
      data: { label: `${type} node`, store: 0 },
    }
    setNodes((nds) => nds.concat(newNode))
  }

  const fitViewOptions = { padding: 0.2 }

  return (
    <div className='dndflow'>
      <ReactFlowProvider>
        <Sidebar />
        <div className='reactflow-wrapper' ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            edgeTypes={edgeTypes}
            onEdgesDelete={edgeDelTest}
            onNodeDoubleClick={onNodeDoubleClick}
            connectionMode={ConnectionMode.Loose}
            fitView
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitViewOptions={fitViewOptions}
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  )
}
