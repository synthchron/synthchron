import React, { useCallback } from 'react'

import { shallow } from 'zustand/shallow'

import { EditorState, useEditorStore } from '../editor/editorStore/flowStore'
import { FlowPreview } from './FlowPreview'

export const ZustandFlowPreview: React.FC = () => {
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
    <FlowPreview {...{ nodes, edges, nodeTypes, edgeTypes, fitViewOptions }} />
  )
}
