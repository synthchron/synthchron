import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Project } from '../../types/project'

interface PersistentState {
  projects: { [id: string]: Project }
  addProject: (project: Project) => void
  removeProject: (id: string) => void
  updateProject: (id: string, project: Project) => void
}

export const usePersistentStore = create<PersistentState>()(
  devtools(
    persist(
      (set, get) => ({
        projects: {}, // Initial state
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
        updateProject: (id: string, project: Project) => {
          set((state) => ({
            projects: {
              ...state.projects,
              [id]: {
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
