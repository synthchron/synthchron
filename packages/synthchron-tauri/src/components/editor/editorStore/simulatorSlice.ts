import { StateCreator } from 'zustand'

import { SimulationLog } from '@synthchron/simulator/src/types/simulationTypes'
import { Configuration } from '@synthchron/types'
import { XESLog } from '@synthchron/xes'

import { defaultConfiguration } from '../rightSidebar/SimulationConfiguration'
import { EditorState } from './flowStore'

export type ResultType = {
  // TODO: To be updated
  log: XESLog
  statistics: object
  simulationLog: SimulationLog | undefined
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
