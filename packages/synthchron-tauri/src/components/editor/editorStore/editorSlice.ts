import { Edge, Node } from 'reactflow'
import { StateCreator } from 'zustand'

import { ProcessModel } from '@synthchron/simulator'

import { usePersistentStore } from '../../common/persistentStore'
import { EditorState } from './flowStore'

export type EditorSlice = {
  selectedElement: Node | Edge | undefined
  selectElement: (elem: Node | Edge | undefined) => void
  saveFlow: (id: string) => void
}

export const createEditorSlice: StateCreator<
  EditorState,
  [],
  [],
  EditorSlice
> = (set, get) => ({
  selectedElement: undefined,
  saveFlow: (id: string) => {
    const processModel: ProcessModel = get().processModelFlowConfig.serialize(
      get().nodes,
      get().edges,
      get().meta
    )
    usePersistentStore.getState().updateProject(id, {
      projectModel: processModel,
    })
  },
  selectElement: (elem: Node | Edge | undefined) => {
    set({
      selectedElement: elem,
    })
  },
})
