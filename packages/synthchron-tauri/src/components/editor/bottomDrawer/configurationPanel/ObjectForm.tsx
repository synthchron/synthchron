import { Paper, Stack, Switch, TextField, Typography } from '@mui/material'

import { TerminationTypeUnion } from '@synthchron/types'

import { TerminationReasonSelecter } from './TerminationReasonSelector'

interface ObjectFormProps {
  object: object
  set: (key: string, value: unknown) => void
  ignoreKeys?: string[]
}

export const ObjectForm: React.FC<ObjectFormProps> = ({
  object: object,
  set,
  ignoreKeys = [],
}) => {
  if (object == null) return <></>

  return (
    <>
      {Object.entries(object)
        .filter(([key, _value]) => !ignoreKeys.includes(key))
        .map(([key, value]) => (
          <ObjectFormLine key={key} keyName={key} value={value} set={set} />
        ))}
    </>
  )
}

const customObjectToFormComponents = {
  terminationType: (
    obj: TerminationTypeUnion,
    set: (key: string, value: unknown) => void
  ) => (
    <TerminationReasonSelecter
      terminationType={obj}
      setTerminationType={(terminationType) => {
        set('terminationType', terminationType)
      }}
    />
  ),
}

interface ObjectFormLineProps {
  keyName: string
  value: unknown
  set: (key: string, value: unknown) => void
}

const ObjectFormLine: React.FC<ObjectFormLineProps> = ({
  keyName,
  value,
  set,
}) => {
  if (value == null) return <></>

  if (keyName == null) return <></>

  if (typeof value === 'string') {
    return (
      <TextField
        label={camelCaseToString(keyName)}
        fullWidth
        value={value}
        onChange={(event) => set(keyName, event.target.value)}
      />
    )
  }

  if (typeof value === 'number') {
    return (
      <TextField
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        label={camelCaseToString(keyName)}
        fullWidth
        value={(value * 1).toString()}
        onChange={(event) => set(keyName, Number(event.target.value))}
      />
    )
  }

  if (typeof value === 'boolean') {
    return (
      <Switch
        checked={value}
        onChange={(event) => set(keyName, event.target.checked)}
      />
    )
  }

  if (typeof value === 'object' && keyName in customObjectToFormComponents) {
    return (
      <Paper style={{ padding: '16px' }}>
        <Stack spacing={3}>
          {customObjectToFormComponents[
            keyName as keyof typeof customObjectToFormComponents
          ](value as TerminationTypeUnion, set)}
        </Stack>
      </Paper>
    )
  }

  if (typeof value === 'object') {
    return (
      <Stack spacing={3}>
        <Typography>{camelCaseToString(keyName)}</Typography>
        <ObjectForm
          object={value}
          set={(subKey, subValue) => set(keyName, subValue)}
        />
      </Stack>
    )
  }

  return <Typography>{`Unsupported type: ${typeof value}`}</Typography>
}

const camelCaseToString = (key: string) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
}
