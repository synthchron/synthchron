import { useEffect, useRef, useState } from 'react'

import { Button, LinearProgress, Paper, Stack } from '@mui/material'

import {
  PetriNetProcessModel,
  petriNetEngine,
  simulateWithEngine,
} from '@synthchron/simulator'

import { transformFlowToSimulator } from '../../../utils/flowTransformer'
import { TablePreview } from '../../common/TablePreview'
import { ZustandFlowPreview } from '../../common/ZustandFlowPreview'
import { useEditorStore } from '../editorStore/flowStore'
import { ResultType } from '../editorStore/simulatorSlice'
import { SimulationStatisticsAdapter } from './analysisFunctions/SimulationStats'

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

  const abortSimulation = useRef(false)

  useEffect(() => {
    abortSimulation.current = false
    return () => {
      abortSimulation.current = true
    }
  }, [])

  const simulate = async () => {
    let result
    const processModel = transformFlowToSimulator(
      useEditorStore.getState()
    ) as PetriNetProcessModel
    const simulator = simulateWithEngine(
      processModel,
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
      if (abortSimulation.current) {
        break
      }

      setProgress(progress)
      // Do not delete this line, it is needed to update the UI - Ali
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve('done')
        }, 0)
      })
      result = simulationLog
    }
    if (result) {
      return SimulationStatisticsAdapter(result, processModel)
    } else {
      const emptyResult: ResultType = {
        log: { traces: [] },
        statistics: {},
      }
      return emptyResult
    }
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
            simulate().then((result) => {
              setInSimulation(false)
              if (!abortSimulation.current) {
                setResult(result)
                nextStep()
              }
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
