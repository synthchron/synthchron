import { useState } from 'react'

import { Button, LinearProgress, Paper, Stack } from '@mui/material'

import {
  PetriNetProcessModel,
  petriNetEngine,
  simulateWithEngine,
} from '@synthchron/simulator'

import { transformFlowToSimulator } from '../../../utils/flowTransformer'
import { transformSimulatioResultToXESLog } from '../../../utils/simulatorToXESConverter'
import { TablePreview } from '../../common/TablePreview'
import { ZustandFlowPreview } from '../../common/ZustandFlowPreview'
import { useEditorStore } from '../editorStore/flowStore'
import { ResultType } from '../editorStore/simulatorSlice'

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

  const simulate = async () => {
    const simulationResult = transformSimulatioResultToXESLog(
      simulateWithEngine(
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
    )
    const tracesAmount = simulationResult.traces.length

    const eventsAmount = simulationResult.traces.reduce(
      (accumulator, trace) => accumulator + trace.events.length,
      0
    )

    const result: ResultType = {
      log: simulationResult,
      statistics: {
        'number of traces': tracesAmount,
        'number of events': eventsAmount,
      },
    }

    setResult(result)
  }

  return (
    <>
      <Stack direction='row' spacing={2} marginTop={3} marginBottom={3}>
        <Paper style={{ padding: '16px' }}>
          <TablePreview
            object={configuration}
            columnTitles={['Config', 'Value']}
          />
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
            simulate().then(async (_result) => {
              await new Promise((resolve) => setTimeout(resolve, 2500))
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
