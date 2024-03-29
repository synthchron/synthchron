import { useState } from 'react'

import HelpIcon from '@mui/icons-material/Help'
import {
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'

interface MaxStepsFieldProps {
  value: number
  setValue: (value: number) => void
}

// Explanation of this setting
const tooltip = `Will attempt this many generations before stopping. 
Can stop early if the "Simulation Goal" is reached, or return less traces if unique traces are enforced`

export const MaxStepsField: React.FC<MaxStepsFieldProps> = ({
  value,
  setValue,
}) => {
  const [textFieldValue, setTextFieldValue] = useState(value.toString())
  return (
    <Paper
      sx={{
        padding: '16px',
      }}
    >
      <Stack direction={'row'} spacing={2} alignItems='center'>
        <Typography gutterBottom>
          Attempted Generations
          <Tooltip title={tooltip} placement='right'>
            <IconButton>
              <HelpIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </Typography>
        <div style={{ flexGrow: 1 }} />
        <TextField
          value={textFieldValue}
          onChange={(event) => {
            const newVal = Number(event.target.value)
            if (Number(newVal) >= 0) {
              setValue(newVal)
              setTextFieldValue(newVal.toString())
            }
          }}
          size='small'
          variant='outlined'
          label='Traces'
          type='number'
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        />
      </Stack>
    </Paper>
  )
}
