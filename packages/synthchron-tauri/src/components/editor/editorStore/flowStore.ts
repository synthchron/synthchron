import { create } from 'zustand'
import { Edge, Node } from 'reactflow'

import { ProcessModelFlowConfig } from '../processModels/processModelFlowConfig'
import { petriNetFlowConfig } from '../processModels/petriNet/petriNetFlowConfig'
import { createYjsSlice, YjsSlice } from './yjsSlice'
import { yDoc, yDocState } from './yDoc'
import { createFlowSlice, FlowSlice } from './flowSlice'
import { createModelSlice, ModelSlice } from './modelSlice'
import { createEditorSlice, EditorSlice } from './editorSlice'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AwarenessState = any

export type EditorState = YjsSlice &
  FlowSlice &
  ModelSlice &
  EditorSlice & {
    initializeFlow: (
      nodes: Node[],
      edges: Edge[],
      meta: object,
      config: ProcessModelFlowConfig
    ) => void
  }

// this is our useStore hook that we can use in our components to get parts of the store and call actions
export const useEditorStore = create<EditorState>((...args) => ({
  // YDoc state for collaboration
  ...createYjsSlice(...args), // CRDT relevant state
  ...createFlowSlice(...args), // React Flow relevant state
  ...createModelSlice(...args), // Process model relevant state
  ...createEditorSlice(...args), // Editor relevant state

  // Initialize the editor state by setting the yDoc. The yDoc will then propagate changes to the other state variables.
  initializeFlow: (
    nodes: Node[],
    edges: Edge[],
    meta: object,
    config: ProcessModelFlowConfig
  ) => {
    yDoc.destroy()
    nodes.forEach((node) => {
      yDocState.nodesMap.set(node.id, node)
    })
    edges.forEach((edge) => {
      yDocState.edgesMap.set(edge.id, edge)
    })
    Object.entries(meta).forEach(([key, value]) => {
      yDocState.metaMap.set(key, value)
    })
    yDocState.processModelType.insert(0, config.processModelType)
  },
}))

// List of observers for setting Zustand state variables once yjs state changes
const nodeObserver = () => {
  const nodes = Array.from(yDocState.nodesMap.values())
  useEditorStore.setState({
    nodes,
  })
}
yDocState.nodesMap.observe(nodeObserver)

const edgeObserver = () => {
  const edges = Array.from(yDocState.edgesMap.values())
  useEditorStore.setState({
    edges,
  })
}
yDocState.edgesMap.observe(edgeObserver)

const metaObserver = () => {
  const meta = Object.fromEntries(yDocState.metaMap.entries())
  useEditorStore.setState({
    meta,
  })
}
yDocState.metaMap.observe(metaObserver)

const processModelTypeObserver = () => {
  const processModelType = yDocState.processModelType.toString()
  switch (processModelType) {
    case 'petriNet':
      useEditorStore.setState({
        processModelFlowConfig: petriNetFlowConfig,
      })
      break
    default:
      break
  }
}
yDocState.processModelType.observe(processModelTypeObserver)
