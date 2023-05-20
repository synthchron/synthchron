import React from 'react'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import DeleteIcon from '@mui/icons-material/Delete'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import {
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
} from '@mui/material'

import { PostprocessingStepType, SimpleSteps } from '@synthchron/types'

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt: string) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

interface SortableItemProps {
  step: SimpleSteps
  setStep: (step: SimpleSteps | undefined) => void
  id: number
}

export const SortableItem: React.FC<SortableItemProps> = ({
  step,
  setStep,
  id,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div style={style} ref={setNodeRef} {...attributes}>
      <Paper sx={{ marginTop: '16px', marginBottom: '16px', p: 2 }}>
        <Stack direction='row' spacing={2}>
          <Select
            value={step.type}
            onChange={(event) => {
              setStep({
                type: event.target.value as PostprocessingStepType,
                weight: step.weight,
              })
            }}
            size='small'
          >
            {[
              PostprocessingStepType.DeletionStep,
              PostprocessingStepType.InsertionStep,
              PostprocessingStepType.SwapStep,
            ].map((type, index) => (
              <MenuItem key={index} value={type}>
                {toTitleCase(type as string)}
              </MenuItem>
            ))}
          </Select>

          {Object.entries(step)
            .filter(([key, _value]) => key !== 'type')
            .map(([key, value], index) => (
              <TextField
                key={index}
                label={toTitleCase(key)}
                value={value}
                type='number'
                onChange={(event) => {
                  // only allow numbers
                  /* 
                  if (event.target.value === '') {
                    setStep({
                      ...step,
                      [key]: 0,
                    })
                    return
                  } */
                  setStep({
                    ...step,
                    [key]: event.target.value,
                  })
                }}
                size='small'
              />
            ))}

          {/* Delete Button */}
          <IconButton
            aria-label='delete'
            style={{
              alignSelf: 'center',
              marginLeft: 'auto',
            }}
            onClick={() => {
              setStep(undefined)
            }}
          >
            <DeleteIcon />
          </IconButton>

          {/* Drag Handle */}
          <div
            {...listeners}
            style={{
              cursor: 'grab',
              alignSelf: 'center',
            }}
          >
            <DragIndicatorIcon />
          </div>
        </Stack>
      </Paper>
    </div>
  )
}
