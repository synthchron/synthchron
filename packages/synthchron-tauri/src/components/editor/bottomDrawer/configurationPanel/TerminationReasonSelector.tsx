import { MenuItem, Select, TextField, Typography } from '@mui/material'

import { TerminationTypeUnion } from '@synthchron/simulator'

export enum TerminationType {
  Standard = 'standard',
  Coverage = 'coverage',
  SpecifiedAmountOfTraces = 'specifiedAmountOfTraces',
}

const terminationTypeDefaults: {
  [key in TerminationType]: Omit<TerminationTypeUnion, 'type'>
} = {
  [TerminationType.Standard]: {},
  [TerminationType.Coverage]: {
    coverage: 100,
  },
  [TerminationType.SpecifiedAmountOfTraces]: {
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
        setTerminationType({
          type: newType,
          ...terminationTypeDefaults[newType],
        } as TerminationTypeUnion)
      }}
    >
      {Object.entries(TerminationType).map(([key, value]) => (
        <MenuItem key={key} value={value}>
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
