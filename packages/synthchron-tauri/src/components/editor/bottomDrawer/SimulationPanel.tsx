import { useState } from 'react'

import { Button, LinearProgress, Paper, Stack } from '@mui/material'

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
            simulationDummy().then(async (result) => {
              setResult({
                log: {
                  traces: [],
                },
                statistics: result ?? {},
              })
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
