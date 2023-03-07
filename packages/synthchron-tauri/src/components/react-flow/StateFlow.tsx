import ReactFlow, {
  Background,
  ConnectionMode,
  Controls,
  MiniMap,
  OnInit,
} from 'reactflow'
import { shallow } from 'zustand/shallow'

import 'reactflow/dist/style.css'

import useStore, { RFState } from './flowStore'

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  nodeTypes: state.processModelFlowConfig.nodeTypes,
  edgeTypes: state.processModelFlowConfig.edgeTypes,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
})

interface StateFlowProps {
  onInit?: OnInit
  onDrop?: React.DragEventHandler<HTMLDivElement>
  onDragOver?: React.DragEventHandler<HTMLDivElement>
}

export const StateFlow: React.FC<StateFlowProps> = ({
  onInit,
  onDrop,
  onDragOver,
}) => {
  const {
    nodes,
    edges,
    nodeTypes,
    edgeTypes,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow)

  const fitViewOptions = { padding: 0.2 }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      // Defaults
      fitView
      fitViewOptions={fitViewOptions}
      connectionMode={ConnectionMode.Loose}
      // Drag events
      onInit={onInit}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  )
}
