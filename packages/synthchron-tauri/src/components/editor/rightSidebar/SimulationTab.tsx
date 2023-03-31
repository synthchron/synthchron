import { Button, Container, Typography } from '@mui/material'
import {
  petriNetEngine,
  PetriNetProcessModel,
  simulateWithEngine,
} from '@synthchron/simulator'
import { useEditorStore } from '../editorStore/flowStore'
import { useState } from 'react'
import { transformFlowToSimulator } from '../../../utils/flowTransformer'

export const SimulationTab: React.FC = () => {
  const [simulationResult, setSimulationResult] = useState<object>({})

  const simulate = () => {
    setSimulationResult(
      simulateWithEngine(
        transformFlowToSimulator(
          useEditorStore.getState()
        ) as PetriNetProcessModel,
        { endOnAcceptingState: true, minEvents: 1, maxEvents: 100 },
        petriNetEngine
      )
    )
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
      <pre>{JSON.stringify(simulationResult, null, 2)}</pre>
    </Container>
  )
}
