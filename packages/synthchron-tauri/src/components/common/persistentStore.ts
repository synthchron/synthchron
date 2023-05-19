import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { Configuration } from '@synthchron/simulator'

import { Project } from '../../types/project'

export interface PersistentState {
  // Project storage
  projects: { [id: string]: Project }
  addProject: (project: Project) => string
  removeProject: (id: string) => void
  updateProject: (id: string, project: Partial<Project>) => void
  // Saving project state
  saving: boolean
  doneSaving: () => void
  // Configuration storage
  configurations: Configuration[]
  setConfigurations: (configurations: Configuration[]) => void
  addConfiguration: (configuration: Configuration) => void
  removeConfiguration: (name: string) => void
  updateConfiguration: (
    sourcename: string,
    targetname: string,
    updatedConfiguration: Partial<Configuration>
  ) => void
}

export const usePersistentStore = create<PersistentState>()(
  devtools(
    persist<PersistentState>(
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
          return id.toString()
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
          if (id in get().projects === false) {
            return
          }
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
        configurations: [],
        setConfigurations: (configurations: Configuration[]) => {
          set({ configurations })
        },
        addConfiguration: (configuration: Configuration) => {
          set((state) => ({
            configurations: [
              ...state.configurations.filter(
                (configuration) =>
                  configuration.configurationName !==
                  configuration.configurationName
              ),
              {
                ...configuration,
                created: new Date().toJSON(),
              },
            ],
          }))
        },
        removeConfiguration: (name: string) => {
          set((state) => ({
            configurations: state.configurations.filter(
              (configuration) => configuration.configurationName !== name
            ),
          }))
        },
        updateConfiguration: (
          sourcename: string,
          targetname: string,
          updatedConfiguration: Partial<Configuration>
        ) => {
          set((state) => ({
            configurations: state.configurations.map((configuration) => {
              if (configuration.configurationName === sourcename) {
                return {
                  ...configuration,
                  ...updatedConfiguration,
                  configurationName: targetname,
                  lastEdited: new Date().toJSON(),
                }
              }
              return configuration
            }),
          }))
        },
      }),
      {
        name: 'synthchron-storage',
      }
    )
  )
)
