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

const tooltip = `Stops the simulation early once a specified goal is reached.`

const options = [
  {
    option: TerminationType.Standard,
    title: 'None',
    explanation: 'Generate the configured amount of traces',
  },
  {
    option: TerminationType.Coverage,
    title: 'Coverage',
    explanation: 'Stop once a given coverage is reached',
  },
  {
    option: TerminationType.SpecifiedAmountOfTraces,
    title: 'Generated Traces',
    explanation: `Stop once the specified amount of traces has been generated. 
    Only useful when used together with the "Enforce Unique Traces" option.`,
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
      Simulation Goal
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
            {key.title}
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
