import { useCallback } from 'react'

import ReactFlow, {
  Background,
  ConnectionMode,
  Controls,
  Edge,
  MiniMap,
  Node,
  OnInit,
  useReactFlow,
} from 'reactflow'
import { shallow } from 'zustand/shallow'

import { AwarenessCursors } from './AwarenessCursors'
import { EditorState, useEditorStore } from './editorStore/flowStore'

import 'reactflow/dist/style.css'

const selector = (state: EditorState) => ({
  setAwarenessState: state.setAwarenessState,
  nodes: state.nodes,
  edges: state.edges,
  nodeTypes: state.processModelFlowConfig.nodeTypes,
  edgeTypes: state.processModelFlowConfig.edgeTypes,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  selectElement: state.selectElement,
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
    setAwarenessState,
    nodes,
    edges,
    nodeTypes,
    edgeTypes,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectElement,
  } = useEditorStore(selector, shallow)

  const fitViewOptions = { padding: 0.2 }

  const reactFlow = useReactFlow()

  const setAwarenessCursor: React.PointerEventHandler<HTMLDivElement> =
    useCallback(
      (event) => {
        const viewport = reactFlow.getViewport()
        setAwarenessState({
          x:
            (event.clientX - event.currentTarget.offsetLeft - viewport.x) /
            viewport.zoom,
          y:
            (event.clientY - event.currentTarget.offsetTop - viewport.y) /
            viewport.zoom,
        })
      },
      [reactFlow, setAwarenessState]
    )

  const selectElementCallback = useCallback(
    (_: unknown, clickable: Node | Edge | undefined) => {
      selectElement(clickable)
    },
    [selectElement]
  )

  const selectPaneCallback = useCallback(
    (_: unknown) => {
      selectElement(undefined)
    },
    [selectElement]
  )

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
      //OnClickEvents
      onNodeDrag={selectElementCallback}
      onNodeClick={selectElementCallback}
      onEdgeClick={selectElementCallback}
      onPaneClick={selectPaneCallback}
      onPointerMove={setAwarenessCursor}
    >
      <AwarenessCursors />
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  )
}
