import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Project } from '../../types/project'

interface PersistentState {
  projects: { [id: string]: Project }
  saving: boolean
  doneSaving: () => void
  addProject: (project: Project) => void
  removeProject: (id: string) => void
  updateProject: (id: string, project: Partial<Project>) => void
}

export const usePersistentStore = create<PersistentState>()(
  devtools(
    persist(
      (set, get) => ({
        projects: {}, // Initial state
        saving: false,
        doneSaving: () => {
          set({ saving: false })
        },
        addProject: (project: Project) => {
          // Create ID that does not exist yet
          let id = Math.floor(Math.random() * 1000000)
          while (get().projects[id]) {
            id = Math.floor(Math.random() * 1000000)
          }
          set((state) => ({
            projects: {
              ...state.projects,
              [id]: {
                ...project,
                created: new Date().toJSON(),
              },
            },
          }))
        },
        removeProject: (id: string) => {
          set((state) => {
            const { [id]: _, ...projects } = state.projects
            return {
              projects,
            }
          })
        },
        updateProject: (id: string, project: Partial<Project>) => {
          set((state) => ({
            saving: true,
            projects: {
              ...state.projects,
              [id]: {
                ...state.projects[id],
                ...project,
                lastEdited: new Date().toJSON(),
              },
            },
          }))
        },
      }),
      {
        name: 'synthchron-storage',
      }
    )
  )
)
