import React, { useCallback } from 'react'

import {
  Background,
  ConnectionMode,
  ReactFlow,
  ReactFlowProvider,
} from 'reactflow'
import { shallow } from 'zustand/shallow'

import { AwarenessCursors } from '../editor/AwarenessCursors'
import { EditorState, useEditorStore } from '../editor/editorStore/flowStore'

const FlowPreview: React.FC = () => {
  const selector = useCallback(
    (state: EditorState) => ({
      nodes: state.nodes,
      edges: state.edges,
      nodeTypes: state.processModelFlowConfig.nodeTypes,
      edgeTypes: state.processModelFlowConfig.edgeTypes,
    }),
    []
  )

  const { nodes, edges, nodeTypes, edgeTypes } = useEditorStore(
    selector,
    shallow
  )

  const fitViewOptions = { padding: 0.05, minZoom: 0, maxZoom: 100 }

  return (
    // Define your component's JSX here
    <ReactFlowProvider>
      <ReactFlow
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
      >
        <AwarenessCursors />
        {/* <MiniMap />
      <Controls /> */}
        <Background />
      </ReactFlow>
    </ReactFlowProvider>
  )
}

export default FlowPreview
