import { useState } from 'react'

import { Button, LinearProgress, Paper, Stack } from '@mui/material'

import {
  PetriNetProcessModel,
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

export const SimulationPanel: React.FC<SimulationPanelProps> = ({
  nextStep,
}) => {
  const configuration = useEditorStore((state) => state.config)
  const setResult = useEditorStore((state) => state.setResult)

  const [inSimulation, setInSimulation] = useState(false)
  const [progress, setProgress] = useState(0)

  // Todo:
  // Test Coverage and Specific amount of traces
  // Add unique traces to the simulation
  // Merge changes to the main branch
  // fix tests for the simulator
  // Create tests for the simulatorToXESConverter
  // Develop Random Generator for the Simulator
  // Fix the simulation termination
  const simulate = async () => {
    let result
    const simulator = simulateWithEngine(
      transformFlowToSimulator(
        useEditorStore.getState()
      ) as PetriNetProcessModel,
      {
        ...configuration,
        randomSeed:
          configuration.randomSeed === undefined
            ? Math.floor(Math.random() * Math.pow(2, 31)).toString()
            : configuration.randomSeed,
      },
      petriNetEngine
    )
    for await (const { progress, simulationLog } of simulator) {
      setProgress(progress)
      // Do not delete this line, it is needed to update the UI - Ali
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve('done')
        }, 0)
      })
      result = simulationLog
    }
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
