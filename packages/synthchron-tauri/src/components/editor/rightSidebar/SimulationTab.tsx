import { useState } from 'react'

import { Button, Container, Typography } from '@mui/material'

import {
  PetriNetProcessModel,
  SimulationLog,
  TraceSimulationResult,
  petriNetEngine,
  simulateTraceWithEngine,
  simulateWithEngine,
} from '@synthchron/simulator'
import { Configuration } from '@synthchron/types'
import { serialize } from '@synthchron/xes'

import { transformFlowToSimulator } from '../../../utils/flowTransformer'
import { transformSimulatioResultToXESLog } from '../../../utils/simulatorToXESConverter'
import { useEditorStore } from '../editorStore/flowStore'
import {
  SimulationConfiguration,
  defaultConfiguration,
} from './SimulationConfiguration'

export const SimulationTab: React.FC = () => {
  const [simulationResult, setSimulationResult] = useState<SimulationLog>()
  const [config, setConfig] = useState<Configuration>(defaultConfiguration)

  const simulate = async () => {
    setSimulationResult(
      await simulateWithEngine(
        transformFlowToSimulator(
          useEditorStore.getState()
        ) as PetriNetProcessModel,
        {
          ...config,
          randomSeed:
            config.randomSeed === ''
              ? Math.floor(Math.random() * 100).toString()
              : config.randomSeed,
        },
        petriNetEngine
      )
    )
  }

  const exportSimulation = () => {
    if (simulationResult === undefined) return
    const xesLog = transformSimulatioResultToXESLog(simulationResult)
    const xesString = serialize(xesLog)
    const xmlData = `data:text/xml;charset=utf-8,${encodeURIComponent(
      xesString
    )}`
    const link = document.createElement('a')
    link.href = xmlData
    link.download = 'simulation.xes'
    link.click()
  }
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: '1em',
      }}
    >
      <Typography variant='h6'>Simulate</Typography>
      <SimulationConfiguration onUpdate={setConfig} />
      <Button onClick={simulate}>Simulate</Button>
      <Button onClick={exportSimulation}>Export</Button>
      <pre>{JSON.stringify(simulationResult, null, 2)}</pre>
    </Container>
  )
}
