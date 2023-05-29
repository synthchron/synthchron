import { useState } from 'react'

import { Button, Container, Typography } from '@mui/material'

import {
  PetriNetProcessModel,
  SimulationLog,
  petriNetEngine,
  simulateWithEngine,
} from '@synthchron/simulator'
import { Configuration, TerminationType } from '@synthchron/types'

import { transformFlowToSimulator } from '../../../utils/flowTransformer'
import { TraceVisualizer } from '../../common/TraceVisualizer'
import { useEditorStore } from '../editorStore/flowStore'

const testConfig: Configuration = {
  endOnAcceptingStateProbability: 100,
  maximumTraces: 1,
  postprocessing: {
    stepProbability: 0,
    postProcessingSteps: [],
  },
  terminationType: {
    type: TerminationType.Standard,
  },
  uniqueTraces: false,
  configurationName: 'testconfig',
  maxEvents: 500,
  minEvents: 0,
  randomSeed: undefined,
}

export const SimulationTab: React.FC = () => {
  const [simulationResult, setSimulationResult] = useState<SimulationLog>()

  const simulate = async () => {
    let result
    const simulator = simulateWithEngine(
      transformFlowToSimulator(
        useEditorStore.getState()
      ) as PetriNetProcessModel,
      {
        ...testConfig,
        randomSeed: Math.floor(Math.random() * Math.pow(2, 31)).toString(),
      },
      petriNetEngine
    )
    for await (const simulation of simulator) {
      result = simulation.simulationLog
    }
    setSimulationResult(result)
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
      <Typography variant='caption' sx={{ marginTop: '1em' }}>
        Verify the behaviour of your process model by generating and inspecting
        example traces. Traces are limited to 500 events. Use the simulation
        panel to run full simulations.
      </Typography>
      <Button
        onClick={simulate}
        variant='contained'
        sx={{ marginTop: '1em', marginBottom: '1em' }}
      >
        Generate Trace
      </Button>
      {simulationResult && (
        <TraceVisualizer
          trace={simulationResult.simulationResults[0]}
          firstN={8}
          lastN={8}
        />
      )}
    </Container>
  )
}
