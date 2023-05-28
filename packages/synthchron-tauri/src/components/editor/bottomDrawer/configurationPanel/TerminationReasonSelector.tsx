import HelpIcon from '@mui/icons-material/Help'
import {
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'

import { TerminationType, TerminationTypeUnion } from '@synthchron/types'

const terminationTypeDefaults: {
  [key in TerminationType]: TerminationTypeUnion
} = {
  [TerminationType.Standard]: {
    type: TerminationType.Standard,
  },
  [TerminationType.Coverage]: {
    type: TerminationType.Coverage,
    coverage: 100,
  },
  [TerminationType.SpecifiedAmountOfTraces]: {
    type: TerminationType.SpecifiedAmountOfTraces,
    amountOfTraces: 1,
  },
}

const tooltip = `Choose which property determines sufficent traces.`

const options = [
  {
    option: TerminationType.Standard,
    explanation: 'Run for the maximum number of simulations',
  },
  {
    option: TerminationType.Coverage,
    explanation: 'Run until the given event coverage is reached',
  },
  {
    option: TerminationType.SpecifiedAmountOfTraces,
    explanation:
      'Run until the given amount of (possibly unique) traces have been found',
  },
]

interface TerminationReasonSelecterProps {
  terminationType: TerminationTypeUnion
  setTerminationType: (terminationType: TerminationTypeUnion) => void
}

export const TerminationReasonSelecter: React.FC<
  TerminationReasonSelecterProps
> = ({ terminationType, setTerminationType }) => (
  <>
    <Typography
      variant='h6'
      gutterBottom
      style={{ marginBottom: -10 }}
      width={'100%'}
    >
      Termination Reason
      <Tooltip
        title={tooltip}
        placement='right'
        sx={{
          ml: 'auto',
        }}
      >
        <IconButton>
          <HelpIcon fontSize='small' />
        </IconButton>
      </Tooltip>
    </Typography>
    <Select
      labelId='termination-type-select-label'
      id='termination-type-select'
      value={terminationType.type}
      onChange={(event) => {
        const newType = event.target.value as TerminationType
        setTerminationType(terminationTypeDefaults[newType])
      }}
    >
      {options.map((key) => (
        <MenuItem key={key.option} value={key.option}>
          <Stack direction='row' alignItems={'center'} width={'100%'}>
            {camelCaseToString(key.option)}
            <Tooltip
              title={key.explanation}
              placement='right'
              sx={{
                marginTop: -2,
                marginBottom: -2,
                marginLeft: 'auto',
              }}
            >
              <IconButton>
                <HelpIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Stack>
        </MenuItem>
      ))}
    </Select>
    {(() => {
      switch (terminationType.type) {
        case TerminationType.Standard:
          return <></>
        case TerminationType.Coverage:
          return (
            <TextField
              label='Coverage'
              fullWidth
              value={terminationType.coverage}
              onChange={(event) => {
                const newCoverage = Number(event.target.value)
                setTerminationType({
                  type: TerminationType.Coverage,
                  coverage: newCoverage,
                })
              }}
            />
          )
        case TerminationType.SpecifiedAmountOfTraces:
          return (
            <TextField
              label='Amount of traces'
              fullWidth
              value={terminationType.amountOfTraces}
              onChange={(event) =>
                setTerminationType({
                  type: TerminationType.SpecifiedAmountOfTraces,
                  amountOfTraces: Number(event.target.value),
                })
              }
            />
          )
      }
    })()}
  </>
)

const camelCaseToString = (key: string) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
}
