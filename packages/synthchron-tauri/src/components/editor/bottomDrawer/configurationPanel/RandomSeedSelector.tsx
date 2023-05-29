import HelpIcon from '@mui/icons-material/Help'
import {
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'

interface RandomSeedSelectorProps {
  value?: string
  setValue: (value: string | undefined) => void
}

// Explanation of this setting
const tooltip = 'For reproducibility, you can set a custom seed.'

export const RandomSeedSelector: React.FC<RandomSeedSelectorProps> = ({
  value,
  setValue,
}) => {
  return (
    <Paper
      sx={{
        padding: '16px',
      }}
    >
      <Typography gutterBottom variant='h6'>
        Reproducibility
        <Tooltip title={tooltip} placement='right'>
          <IconButton>
            <HelpIcon fontSize='small' />
          </IconButton>
        </Tooltip>
      </Typography>
      <Stack direction={'row'} spacing={2} alignItems='center'>
        <Typography>Use custom seed</Typography>
        <Switch
          checked={value !== undefined}
          onChange={() => setValue(value !== undefined ? undefined : '')}
        />
        <div style={{ flexGrow: 1 }} />
        <TextField
          value={value || ''}
          onChange={(event) => setValue(event.target.value)}
          disabled={value === undefined}
          size='small'
          variant='outlined'
          label='Seed'
        />
      </Stack>
    </Paper>
  )
}
