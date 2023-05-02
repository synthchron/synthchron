import { StateCreator } from 'zustand'

import { ProcessModel } from '@synthchron/simulator'

import { usePersistentStore } from '../../common/persistentStore'
import { EditorState } from './flowStore'

export type EditorSlice = {
  saveFlow: (id: string) => void
  getProcessModel: () => ProcessModel
}

export const createEditorSlice: StateCreator<
  EditorState,
  [],
  [],
  EditorSlice
> = (_set, get) => ({
  saveFlow: (id: string) => {
    usePersistentStore.getState().updateProject(id, {
      projectModel: get().getProcessModel(),
    })
  },
  getProcessModel: () =>
    get().processModelFlowConfig.serialize(
      get().nodes,
      get().edges,
      get().meta
    ),
})
