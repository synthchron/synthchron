import { useEffect, useState } from 'react'

import { TextField } from '@mui/material'

export enum labelChangeError {
  noError = '',
  labelNotUnique = 'Label is not Unique',
  notJSVariable = 'Label is not an accepted identifier',
  containsWhiteSpace = 'Label must not contain whitespace',
}

type LabelPropertyProperties = {
  value: string
  changeSelectedPlaceLabel: (
    newLabel: string,
    oldLabel: string
  ) => labelChangeError
}

export const LabelProperty: React.FC<LabelPropertyProperties> = ({
  value,
  changeSelectedPlaceLabel,
}) => {
  const [error, setError] = useState('')
  const [textValue, setTextValue] = useState(value)
  const [actValue, setActValue] = useState(textValue)

  const onChangeLabel = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    changeSelectedPlaceLabel: (
      newLabel: string,
      oldLabel: string
    ) => labelChangeError
  ) => {
    const newLabel = event.target.value.trim()
    const JSidentifierRegex =
      /^[$_\p{ID_Start}][$\u200c\u200d\p{ID_Continue}]*/u
    if (JSidentifierRegex.test(newLabel)) {
      const result = changeSelectedPlaceLabel(newLabel, actValue)
      setError(result)
      if (result == labelChangeError.noError) {
        setActValue(newLabel)
      }
    } else {
      setError(labelChangeError.notJSVariable)
    }

    setTextValue(event.target.value)
  }

  useEffect(() => {
    setTextValue(value)
  }, [value])

  return (
    <TextField
      label='label'
      variant='outlined'
      fullWidth
      size='small'
      value={textValue}
      onChange={(event) => onChangeLabel(event, changeSelectedPlaceLabel)}
      {...(error ? { error: true, helperText: error } : {})}
    ></TextField>
  )
}
