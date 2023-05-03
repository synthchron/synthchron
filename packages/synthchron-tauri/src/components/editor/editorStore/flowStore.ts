import { Edge, Node } from 'reactflow'
import { create } from 'zustand'

import { petriNetFlowConfig } from '../processModels/petriNet/petriNetFlowConfig'
import { ProcessModelFlowConfig } from '../processModels/processModelFlowConfig'
import { EditorSlice, createEditorSlice } from './editorSlice'
import { FlowSlice, createFlowSlice } from './flowSlice'
import { ModelSlice, createModelSlice } from './modelSlice'
import { yDoc, yDocState } from './yDoc'
import { YjsSlice, createYjsSlice } from './yjsSlice'

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
      config: ProcessModelFlowConfig,
      projectId: string
    ) => void
  }

// this is our useStore hook that we can use in our components to get parts of the store and call actions
export const useEditorStore = create<EditorState>((set, get, api) => ({
  // YDoc state for collaboration
  ...createYjsSlice(set, get, api), // CRDT relevant state
  ...createFlowSlice(set, get, api), // React Flow relevant state
  ...createModelSlice(set, get, api), // Process model relevant state
  ...createEditorSlice(set, get, api), // Editor relevant state

  // Initialize the editor state by setting the yDoc. The yDoc will then propagate changes to the other state variables.
  initializeFlow: (
    nodes: Node[],
    edges: Edge[],
    meta: object,
    config: ProcessModelFlowConfig,
    projectId: string
  ) => {
    get().saveFlow() // This autosaved in case we switch projects
    useEditorStore.setState({
      projectId,
    })
    yDoc.destroy()
    yDocState.nodesMap.clear()
    nodes.forEach((node) => {
      yDocState.nodesMap.set(node.id, node)
    })
    yDocState.edgesMap.clear()
    edges.forEach((edge) => {
      yDocState.edgesMap.set(edge.id, edge)
    })
    yDocState.metaMap.clear()
    Object.entries(meta).forEach(([key, value]) => {
      yDocState.metaMap.set(key, value)
    })
    yDocState.processModelType.delete(0, yDocState.processModelType.length)
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
