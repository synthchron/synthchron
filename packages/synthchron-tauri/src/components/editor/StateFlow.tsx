import ReactFlow, {
  Background,
  ConnectionMode,
  Controls,
  MiniMap,
  OnInit,
  useStore,
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
  } = useEditorStore(selector, shallow)

  const fitViewOptions = { padding: 0.2 }
  const { selectElement } = useEditorStore(selector, shallow)

  const transform = useStore((store) => store.transform)

  const setAwarenessCursor: React.PointerEventHandler<HTMLDivElement> = (
    event
  ) => {
    setAwarenessState({
      x:
        (event.clientX - event.currentTarget.offsetLeft - transform[0]) /
        transform[2],
      y:
        (event.clientY - event.currentTarget.offsetTop - transform[1]) /
        transform[2],
    })
  }

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
      onNodeClick={(_, node) => {
        selectElement(node)
      }}
      onEdgeClick={(_, edge) => {
        selectElement(edge)
      }}
      onPaneClick={(_) => {
        selectElement(undefined)
      }}
      onPointerMove={setAwarenessCursor}
    >
      <AwarenessCursors />
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  )
}
