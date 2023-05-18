import { useState } from 'react'

import { Button, LinearProgress, Paper, Stack } from '@mui/material'

import { ConfigurationPreview } from '../../common/ConfigurationPreview'
import FlowPreview from '../../common/FlowPreview'
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
    result: 'Simulation finished',
  }
}

export const SimulationPanel: React.FC<SimulationPanelProps> = ({
  nextStep,
}) => {
  const configuration = useEditorStore((state) => state.config)

  const [inSimulation, setInSimulation] = useState(false)
  const [progress, setProgress] = useState(0)

  const simulationDummy = async () => {
    let result
    for await (const p of simulatorDummy()) {
      setProgress(p.progress)
      result = p.result
    }
    return result
  }

  return (
    <>
      <Stack direction='row' spacing={2} marginTop={3} marginBottom={3}>
        <Paper style={{ padding: '16px' }}>
          <ConfigurationPreview configuration={configuration} />
        </Paper>
        <Paper style={{ paddingRight: '5px', flexGrow: 1 }}>
          <FlowPreview />
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
            simulationDummy().then(async (result) => {
              console.log(result) //TODO: do something with the result
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
