import React, { useEffect, useId } from 'react'

import {
  Background,
  ConnectionMode,
  Edge,
  EdgeTypes,
  FitViewOptions,
  Node,
  NodeTypes,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  useStore,
} from 'reactflow'

import { AwarenessCursors } from '../editor/AwarenessCursors'

interface FlowPreviewProps {
  nodes: Node[]
  edges: Edge[]
  nodeTypes: NodeTypes
  edgeTypes: EdgeTypes
  fitViewOptions?: FitViewOptions
  awarenessCursors?: boolean
}

export const FlowPreview: React.FC<FlowPreviewProps> = (props) => {
  return (
    <ReactFlowProvider>
      <InnerFlow {...props} />
    </ReactFlowProvider>
  )
}

const InnerFlow: React.FC<FlowPreviewProps> = ({
  nodes,
  edges,
  nodeTypes,
  edgeTypes,
  fitViewOptions,
  awarenessCursors,
}) => {
  const id = useId()
  const reactFlowInstance = useReactFlow()

  const width = useStore((state) => state.width)
  const height = useStore((state) => state.height)

  useEffect(() => {
    reactFlowInstance?.fitView(fitViewOptions)
  }, [width, height])

  return (
    <ReactFlow
      id={id}
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      // Defaults
      fitView
      fitViewOptions={fitViewOptions}
      connectionMode={ConnectionMode.Loose}
      // Interaction blockers
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      panOnDrag={false}
      zoomOnScroll={false}
      zoomOnDoubleClick={false}
      // Thank you @react-flow developers
      proOptions={{
        hideAttribution: true,
      }}
    >
      {awarenessCursors && <AwarenessCursors />}
      <Background />
    </ReactFlow>
  )
}
