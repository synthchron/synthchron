import { StateCreator } from 'zustand'

import { ProcessModel } from '@synthchron/simulator'

import { usePersistentStore } from '../../common/persistentStore'
import { EditorState } from './flowStore'

export type EditorSlice = {
  saveFlow: () => void
  getProcessModel: () => ProcessModel
  projectId: string | undefined
  setProjectId: (id: string) => void
  sessionStart: number
}

export const createEditorSlice: StateCreator<
  EditorState,
  [],
  [],
  EditorSlice
> = (set, get) => ({
  saveFlow: async () => {
    const projectId = get().projectId
    if (projectId === undefined) return
    usePersistentStore.getState().updateProject(projectId, {
      projectModel: get().getProcessModel(),
    })
  },
  getProcessModel: () =>
    get().processModelFlowConfig.serialize(
      get().nodes,
      get().edges,
      get().meta
    ),
  projectId: undefined,
  setProjectId: (id: string) => {
    set({ projectId: id })
  },
  sessionStart: new Date().getTime(),
})
