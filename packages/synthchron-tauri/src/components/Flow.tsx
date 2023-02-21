import { useCallback } from 'react';
import ReactFlow, {
	MiniMap,
	Controls,
	Background,
	useNodesState,
	useEdgesState,
	addEdge,
	MarkerType,
	ConnectionMode,
	Edge
} from 'reactflow';

// 👇 you need to import the reactflow styles
import 'reactflow/dist/style.css';
import "./customNodes/NodeStyle.css";
import "./customEdges/EdgeStyle.css";
import PlaceNode from './customNodes/PlaceNode';
import TransitionNode from './customNodes/TransitionNode';
import ArcEdge from './customEdges/ArcEdge';
import {getNodeText} from "@storybook/testing-library";
import {match} from "assert";



const initialNodes = [
  { id: '1', type: 'Place', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
  { id: '3', type: 'Place', position: { x: 700, y: 300 }, data: { label: '1' } },
  { id: '4', type: 'Place', position: { x: 500, y: 500 }, data: { label: '1' } },
  { id: '5', type: 'Transition', position: { x: 400, y: 300 }, data: { label: '1' } },
];

const nodeTypes = {
  Place: PlaceNode,
  Transition: TransitionNode
};

const edgeTypes = {
  Arc: ArcEdge,
};


const initialEdges = [
    {
        id: 'e1-3', type: 'Arc', source: '1', target: '3', sourceHandle: 'c',
        targetHandle: 'a',  markerEnd: { type: MarkerType.ArrowClosed }
    }
    ];

export default Flow;


function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

	function get_node(nodeId: string) {
		return nodes.find((node) => {
			if (node.id == nodeId) {
				return node;
			}
		})
	}

  const onConnect = useCallback(
		(params:any) =>
			setEdges((eds : (Edge<any>) []) =>
				{
					let sourceNode = get_node(params.source);
					let targetNode = get_node(params.target);

					let is_invalid = edges.every(edge =>
					{
						// checking if another edge already exists
						if (edge.source == params.source && edge.target == params.target) return true;

						return false;
					})

					// returning without the added note if invalid found
					if (is_invalid) {
						return eds;
					}

					// Checking both nodes exists
					if (sourceNode == undefined || targetNode == undefined) return eds;

					// Checking if it is valid connection for a place node
					if (sourceNode.type == 'Place') {
						if (targetNode.type == 'Place') {
							return eds;
						}
					}

					// Checking if it is valid connection for a transition node
					if (sourceNode.type == 'Transition') {
						if (targetNode.type == 'Transition') {
							return eds;
						}
					}

					// Add edge to the list of edges
					return addEdge({ ...params, type: 'Arc', markerEnd: { type: MarkerType.ArrowClosed } }, eds);
				}
			),
		[setEdges]
    );
  
  const fitViewOptions = { padding: 0.2 };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      connectionMode = {ConnectionMode.Loose} 
      fitView
      fitViewOptions={fitViewOptions}
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  );
}