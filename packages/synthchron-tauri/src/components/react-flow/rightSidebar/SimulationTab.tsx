import { Button, Container, Typography } from '@mui/material'
import {
  petriNetEngine,
  PetriNetProcessModel,
  simulateWithEngine,
  SimulationResult,
} from '@synthchron/simulator'
import { useFlowStore } from '../ydoc/flowStore'
import { transformFlowToSimulator } from '../../flowTransformer'
import { useState } from 'react'
import { transformSimulatioResultToXESLog } from '../../../utils/simulatorToXESConverter'
import { generateXES } from '@synthchron/xes'

export const SimulationTab: React.FC = () => {
  const [simulationResult, setSimulationResult] = useState<SimulationResult>()

  const simulate = () => {
    setSimulationResult(
      simulateWithEngine(
        transformFlowToSimulator(
          useFlowStore.getState()
        ) as PetriNetProcessModel,
        { endOnAcceptingState: true, minEvents: 1, maxEvents: 100 },
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
