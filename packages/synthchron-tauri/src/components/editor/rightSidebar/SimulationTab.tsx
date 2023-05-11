import { useState } from 'react'

import { Button, Container, Typography } from '@mui/material'

import {
  PetriNetProcessModel,
  SimulationResult,
  petriNetEngine,
  simulateWithEngine,
} from '@synthchron/simulator'
import { terminationType } from '@synthchron/simulator'
import { generateXES } from '@synthchron/xes'

import { transformFlowToSimulator } from '../../../utils/flowTransformer'
import { transformSimulatioResultToXESLog } from '../../../utils/simulatorToXESConverter'
import { useEditorStore } from '../editorStore/flowStore'

export const SimulationTab: React.FC = () => {
  const [simulationResult, setSimulationResult] = useState<SimulationResult>()

  const simulate = () => {
    setSimulationResult(
      simulateWithEngine(
        transformFlowToSimulator(
          useEditorStore.getState()
        ) as PetriNetProcessModel,
        {
          configurationName: 'example',
          endOnAcceptingStateProbability: 0.5,
          minEvents: 1,
          maxEvents: 100,
          randomSeed: Math.floor(Math.random() * 100).toString(),
          terminationType: {
            type: terminationType.Standard,
          },
        },
        petriNetEngine
      )
    )
  }
  const exportSimulation = () => {
    if (simulationResult === undefined) return
    const xesLog = transformSimulatioResultToXESLog(simulationResult)
    const xesString = generateXES(xesLog)
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
      <Button onClick={simulate}>Simulate</Button>
      <Button onClick={exportSimulation}>Export</Button>
      <pre>{JSON.stringify(simulationResult, null, 2)}</pre>
    </Container>
  )
}
