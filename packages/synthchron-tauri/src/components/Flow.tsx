import { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  ConnectionMode
} from 'reactflow';
// 👇 you need to import the reactflow styles
import 'reactflow/dist/style.css';
import "./customNodes/NodeStyle.css";
import "./customEdges/EdgeStyle.css";
import PlaceNode from './customNodes/TestNode';
import TransitionNode from './customNodes/TransitionNode';
import ArcEdge from './customEdges/ArcEdge';



const initialNodes = [
  { id: '1', type: 'Place', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
  { id: '3', type: 'Place', position: { x: 700, y: 300 }, data: { label: '1' } },
  { id: '4', type: 'Place', position: { x: 500, y: 500 }, data: { label: '1' } },
  { id: '5', type: 'Transition', position: { x: 400, y: 300 }, data: { label: '1' } },
];
const nodeTypes = { Place: PlaceNode, Transition: TransitionNode };
const edgeTypesC = {
  Arc: ArcEdge,
};


const initialEdges = [{ id: 'e1-3', type: 'Arc', source: '1', target: '3', sourceHandle: 'c',
targetHandle: 'a',  markerEnd: { type: MarkerType.ArrowClosed },}];

export default Flow;


function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params:any) => setEdges((eds) =>  
              addEdge({ ...params, type: 'Arc', markerEnd: { type: MarkerType.ArrowClosed } }, eds)), [setEdges]);
  
  const fitViewOptions = { padding: 0.2 };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypesC}
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