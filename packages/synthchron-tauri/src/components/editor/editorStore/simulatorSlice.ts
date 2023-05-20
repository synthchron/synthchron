import { StateCreator } from 'zustand'

import { Configuration } from '@synthchron/simulator'
import { XESLog } from '@synthchron/xes'

import { defaultConfiguration } from '../rightSidebar/SimulationConfiguration'
import { EditorState } from './flowStore'

type ResultType = {
  // TODO: To be updated
  log: XESLog
  statistics: object
}

export type SimulatorSlice = {
  config: Configuration
  setConfig: (configuration: Configuration) => void
  result?: ResultType
  setResult: (result: ResultType) => void
}

export const createSimulatorSlice: StateCreator<
  EditorState,
  [],
  [],
  SimulatorSlice
> = (set, _get) => ({
  config: defaultConfiguration,
  setConfig: (config: Configuration) => {
    set({ config })
  },
  result: undefined,
  setResult: (result: ResultType) => {
    set({ result })
  },
})
