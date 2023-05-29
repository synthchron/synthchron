import HelpIcon from '@mui/icons-material/Help'
import {
  IconButton,
  Paper,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material'

interface UniqueTracesSlideProps {
  value?: boolean
  setValue: (value: boolean) => void
}

// Explanation of this setting
const tooltip = `Will force the simulator to only keep unique traces. 
In case of difficult models, this can lead to not enough traces being found. 
Use the maximum traces parameter to increase the number of attempted simulations.`

export const UniqueTracesSlide: React.FC<UniqueTracesSlideProps> = ({
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
        <Typography>Enforce Unique Traces</Typography>
        <Tooltip title={tooltip} placement='right'>
          <IconButton>
            <HelpIcon fontSize='small' />
          </IconButton>
        </Tooltip>
        <div style={{ flexGrow: 1 }} />
        <Switch
          checked={value}
          onChange={(event) => setValue(event.target.checked)}
        />
      </Stack>
    </Paper>
  )
}
