import { Edge, Node } from 'reactflow'
import { Doc } from 'yjs'
import { create } from 'zustand'

import { petriNetFlowConfig } from '../processModels/petriNet/petriNetFlowConfig'
import { ProcessModelFlowConfig } from '../processModels/processModelFlowConfig'
import { defaultConfiguration } from '../rightSidebar/SimulationConfiguration'
import { EditorSlice, createEditorSlice } from './editorSlice'
import { FlowSlice, createFlowSlice } from './flowSlice'
import { ModelSlice, createModelSlice } from './modelSlice'
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
    get().setConfig(defaultConfiguration)
    get().saveFlow() // This autosaved in case we switch projects
    get().disconnectRoom()

    const yDoc = new Doc()
    const nodesMap = yDoc.getMap<Node>('nodes')
    const edgesMap = yDoc.getMap<Edge>('edges')
    const metaMap = yDoc.getMap('meta')
    const processModelType = yDoc.getText('processModelType')

    const nodeObserver = () => {
      const nodes = Array.from(nodesMap.values())
      useEditorStore.setState({
        nodes,
      })
    }
    nodesMap.observe(nodeObserver)

    nodes.forEach((node) => {
      nodesMap.set(node.id, node)
    })

    edges.forEach((edge) => {
      edgesMap.set(edge.id, edge)
    })
    const edgeObserver = () => {
      const edges = Array.from(edgesMap.values())
      useEditorStore.setState({
        edges,
      })
    }
    edgesMap.observe(edgeObserver)

    Object.entries(meta).forEach(([key, value]) => {
      metaMap.set(key, value)
    })
    const metaObserver = () => {
      const meta = Object.fromEntries(metaMap.entries())
      useEditorStore.setState({
        meta,
      })
    }
    metaMap.observe(metaObserver)

    processModelType.insert(0, config.processModelType)
    const processModelTypeObserver = () => {
      switch (processModelType.toString()) {
        case 'petriNet':
          useEditorStore.setState({
            processModelFlowConfig: petriNetFlowConfig,
          })
          break
        default:
          break
      }
    }
    processModelType.observe(processModelTypeObserver)

    set({
      // Setting initial state
      nodes,
      edges,
      meta,
      projectId,

      // Setting yDoc state for collaboration
      yDoc,
      yNodesMap: nodesMap,
      yEdgesMap: edgesMap,
      yMetaMap: metaMap,
      yProcessModelType: processModelType,
    })
  },
}))
