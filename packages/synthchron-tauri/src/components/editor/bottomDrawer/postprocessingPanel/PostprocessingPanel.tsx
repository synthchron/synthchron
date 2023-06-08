import React, { useCallback, useEffect, useState } from 'react'

import HelpIcon from '@mui/icons-material/Help'
import {
  Checkbox,
  Collapse,
  Divider,
  IconButton,
  Paper,
  Slider,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { debounce } from 'lodash'

import {
  PostprocessingConfiguration,
  PostprocessingStepType,
} from '@synthchron/types'

import { PostprocessingCheckboxLine } from './PostprocessingCheckboxLine'

const postprocessingText = `Apply postprocessing steps to the generated traces to add noise. 
The noise probability controls whether noise should be applied to an event.
Use the advanced settings to control the relative weights of each noise type.`

const noiseWeightText = `Choose relative noise type weights. A higher weight means that the noise 
type will be more likely. Twice the weight means twice as likely. All weights sum to 1.`

const POSTPROCESSING_STEPS = [
  PostprocessingStepType.InsertionStep,
  PostprocessingStepType.DeletionStep,
  PostprocessingStepType.SwapStep,
]

interface PostprocessingPanelProps {
  name?: string
  postprocessing: PostprocessingConfiguration
  setPostprocessing: (
    f: (p: PostprocessingConfiguration) => PostprocessingConfiguration
  ) => void
}

export const PostprocessingPanel: React.FC<PostprocessingPanelProps> = ({
  name,
  postprocessing,
  setPostprocessing,
}) => {
  const [sliderValue, setSliderValue] = useState(postprocessing.stepProbability)

  const [weightValues, setWeightValues] = useState<number[]>(
    POSTPROCESSING_STEPS.map(() => 1 / POSTPROCESSING_STEPS.length)
  )

  const [open, setOpen] = useState(false)

  // Temporary
  useEffect(() => {
    setSliderValue(postprocessing.stepProbability)
    if (
      postprocessing.postProcessingSteps.length !== POSTPROCESSING_STEPS.length
    )
      setPostprocessing((postprocessing: PostprocessingConfiguration) => ({
        ...postprocessing,
        postProcessingSteps: POSTPROCESSING_STEPS.map((step) => ({
          type: step,
          weight: 1 / POSTPROCESSING_STEPS.length,
        })),
      }))
    else
      setWeightValues(
        postprocessing.postProcessingSteps.map((step) => step.weight)
      )
  }, [name])

  const sliderDebouncedChange = useCallback(
    debounce((value) => {
      setPostprocessing((postprocessing: PostprocessingConfiguration) => ({
        ...postprocessing,
        stepProbability: value as number,
        postProcessingSteps: postprocessing.postProcessingSteps,
      }))
    }, 75),
    [setPostprocessing]
  )

  const weightDebouncedChange = useCallback(
    debounce((value: number[]) => {
      setPostprocessing((postprocessing: PostprocessingConfiguration) => ({
        ...postprocessing,
        postProcessingSteps: postprocessing.postProcessingSteps.map(
          (step, index) => ({
            ...step,
            weight: value[index],
          })
        ),
      }))
    }, 75),
    [setPostprocessing]
  )

  const updateWeight = useCallback(
    (index: number, value: number) => {
      const oldSum = weightValues.reduce((a, b) => a + b, 0)
      const oldFractionOfOthers = (oldSum - weightValues[index]) / oldSum
      const newFractionOfOthers = 1 - value
      const newWeightValues = weightValues.map((weight, i) =>
        i === index
          ? value
          : oldFractionOfOthers <= 0
          ? Number((newFractionOfOthers / (weightValues.length - 1)).toFixed(2))
          : Number(
              ((weight / oldFractionOfOthers) * newFractionOfOthers).toFixed(2)
            )
      )
      setWeightValues(newWeightValues)
      weightDebouncedChange(newWeightValues)
    },
    [weightValues, weightDebouncedChange]
  )

  return (
    <Paper sx={{ padding: '16px' }}>
      <Typography variant='h6' gutterBottom>
        Postprocessing
        <Tooltip title={postprocessingText} placement='right'>
          <IconButton>
            <HelpIcon fontSize='small' />
          </IconButton>
        </Tooltip>
      </Typography>
      <Typography variant='body2' gutterBottom>
        Noise probability
      </Typography>
      <Slider
        sx={{
          // add space left and right
          width: 'calc(100% - 16px)',
        }}
        value={sliderValue}
        onChange={(event, value) => {
          setSliderValue(value as number)
          sliderDebouncedChange(value)
        }}
        valueLabelDisplay='auto'
        step={0.01}
        min={0}
        max={1}
        marks={[
          { value: 0, label: '0%' },
          { value: 1, label: '100%' },
        ]}
      />
      <Divider
        sx={{
          marginTop: '16px',
          marginBottom: '16px',
        }}
      />

      <Stack
        direction='row'
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant='body2' gutterBottom>
          Show Advanced Settings
        </Typography>
        <Checkbox checked={open} onChange={() => setOpen(!open)} />
      </Stack>
      <Divider
        sx={{
          marginTop: '16px',
          marginBottom: '16px',
        }}
      />
      <Collapse in={open}>
        <Typography variant='body2' gutterBottom>
          Noise weights
          <Tooltip title={noiseWeightText} placement='right'>
            <IconButton>
              <HelpIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </Typography>
        {POSTPROCESSING_STEPS.map((step, index) => (
          <PostprocessingCheckboxLine
            key={step}
            label={step}
            value={weightValues[index]}
            setValue={(value) => {
              updateWeight(index, value)
            }}
          />
        ))}
      </Collapse>
    </Paper>
  )
}
