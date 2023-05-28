import { useState } from 'react'

import HelpIcon from '@mui/icons-material/Help'
import {
  IconButton,
  Paper,
  Slider,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'

interface MaxStepsFieldProps {
  value: number
  setValue: (value: number) => void
}

// Explanation of this setting
const tooltip = 'The maximum number of simulations to run.'

export const MaxStepsField: React.FC<MaxStepsFieldProps> = ({
  value,
  setValue,
}) => {
  return (
    <Paper
      sx={{
        padding: '16px',
      }}
    >
      <Stack direction={'row'} spacing={2} alignItems='center'>
        <Typography gutterBottom>
          Simulation Limit
          <Tooltip title={tooltip} placement='right'>
            <IconButton>
              <HelpIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </Typography>
        <div style={{ flexGrow: 1 }} />
        <TextField
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
          size='small'
          variant='outlined'
          label='Max Steps'
          type='number'
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        />
      </Stack>
    </Paper>
  )
}
