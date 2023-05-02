import { StateCreator } from 'zustand'

import { ProcessModel } from '@synthchron/simulator'

import { usePersistentStore } from '../../common/persistentStore'
import { EditorState } from './flowStore'

export type EditorSlice = {
  saveFlow: (id: string) => void
}

export const createEditorSlice: StateCreator<
  EditorState,
  [],
  [],
  EditorSlice
> = (set, get) => ({
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
})
