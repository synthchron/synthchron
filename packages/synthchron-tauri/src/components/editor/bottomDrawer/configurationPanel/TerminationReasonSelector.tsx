import { MenuItem, Select, TextField, Typography } from '@mui/material'

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

interface TerminationReasonSelecterProps {
  terminationType: TerminationTypeUnion
  setTerminationType: (terminationType: TerminationTypeUnion) => void
}

export const TerminationReasonSelecter: React.FC<
  TerminationReasonSelecterProps
> = ({ terminationType, setTerminationType }) => (
  <>
    <Typography variant='h6' gutterBottom style={{ marginBottom: -10 }}>
      Termination Type
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
      {[
        TerminationType.Standard,
        TerminationType.Coverage,
        TerminationType.SpecifiedAmountOfTraces,
      ].map((key) => (
        <MenuItem key={key} value={key}>
          {camelCaseToString(key)}
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
