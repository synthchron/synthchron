import { useEffect, useState } from 'react'

import { TextField } from '@mui/material'

type LabelPropertyProperties = {
  value: string
  changeSelectedPlaceLabel: (newLabel: string, oldLabel: string) => boolean
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
    changeSelectedPlaceLabel: (newLabel: string, oldLabel: string) => boolean
  ) => {
    const newLabel = event.target.value.trim()
    const JSidentifierRegex =
      /^[$_\p{ID_Start}][$\u200c\u200d\p{ID_Continue}]*/u
    if (JSidentifierRegex.test(newLabel)) {
      const result = changeSelectedPlaceLabel(newLabel, actValue)
      if (result) {
        setError('')
        setActValue(newLabel)
      } else {
        setError('Label is not unique')
      }
    } else {
      setError('input is not an accepted identifier')
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
      value={textValue}
      onChange={(event) => onChangeLabel(event, changeSelectedPlaceLabel)}
      {...(error ? { error: true, helperText: error } : {})}
    ></TextField>
  )
}
