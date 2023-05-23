import { useState } from 'react'

import { Button, LinearProgress, Paper, Stack } from '@mui/material'
import { config } from 'process'

import {
  PetriNetProcessModel,
  SimulationLog,
  petriNetEngine,
  simulateWithEngine,
} from '@synthchron/simulator'

import { transformFlowToSimulator } from '../../../utils/flowTransformer'
import { transformSimulationLogToXESLog } from '../../../utils/simulatorToXESConverter'
import { TablePreview } from '../../common/TablePreview'
import { ZustandFlowPreview } from '../../common/ZustandFlowPreview'
import { useEditorStore } from '../editorStore/flowStore'

interface SimulationPanelProps {
  nextStep: () => void
}

async function* simulatorDummy() {
  for (let i = 0; i < 500; i++) {
    await new Promise((resolve) => setTimeout(resolve, 10))
    yield {
      progress: (100 * i) / 500,
      result: undefined,
    }
  }
  yield {
    progress: 100,
    result: {
      'number of events': 500,
      'number of traces': 1200,
    },
  }
}

export const SimulationPanel: React.FC<SimulationPanelProps> = ({
  nextStep,
}) => {
  const configuration = useEditorStore((state) => state.config)
  const setResult = useEditorStore((state) => state.setResult)

  const [inSimulation, setInSimulation] = useState(false)
  const [progress, setProgress] = useState(0)

  // const simulationDummy = async () => {
  //   let result
  //   for await (const p of simulatorDummy()) {
  //     setProgress(p.progress)
  //     result = p.result
  //   }
  //   return result
  // }

  // Todo:
  // Test Coverage and Specific amount of traces
  // Add unique traces to the simulation
  // Merge changes to the main branch
  // fix tests for the simulator
  // Create tests for the simulatorToXESConverter
  // Develop Random Generator for the Simulator
  const simulate = async () => {
    let result
    const simulator = simulateWithEngine(
      transformFlowToSimulator(
        useEditorStore.getState()
      ) as PetriNetProcessModel,
      {
        ...configuration,
        randomSeed:
          configuration.randomSeed === ''
            ? Math.floor(Math.random() * 100).toString()
            : configuration.randomSeed,
      },
      petriNetEngine
    )
    for await (const { progress, simulationLog } of simulator) {
      setProgress(progress)
      // DO not delete this line, it is needed to update the UI - Ali
      await new Promise((resolve) => setTimeout(resolve, 0))
      result = simulationLog
    }
    console.log(result)
    return result
  }
  return (
    <>
      <Stack direction='row' spacing={2} marginTop={3} marginBottom={3}>
        <Paper style={{ padding: '16px' }}>
          <TablePreview object={configuration} />
        </Paper>
        <Paper style={{ paddingRight: '5px', flexGrow: 1 }}>
          <ZustandFlowPreview />
        </Paper>
      </Stack>
      {!inSimulation ? (
        <Button
          variant='contained'
          color='primary'
          fullWidth
          onClick={() => {
            setInSimulation(true)
            setProgress(0)
            simulate().then(async (result) => {
              setResult({
                log: result
                  ? transformSimulationLogToXESLog(result)
                  : { traces: [] },
                statistics: result ?? {},
              })
              // await new Promise((resolve) => setTimeout(resolve, 2500))
              setInSimulation(false)
              nextStep()
            })
          }}
        >
          Simulate Traces
        </Button>
      ) : (
        <LinearProgress
          value={progress}
          variant='determinate'
          style={{
            marginBottom: '16px',
          }}
        />
      )}
    </>
  )
}
