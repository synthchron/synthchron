import { TextField } from '@mui/material'

import { NodeDataFields } from '../PropertiesTab'

const onChangeNumber = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  key: string,
  updateNodeFields: (fields: Partial<NodeDataFields>) => void
) => {
  if (
    Number.isNaN(parseInt(event.target.value)) &&
    !(event.target.value === '')
  ) {
    event.preventDefault
  } else {
    const resNumber = Number(event.target.value) * 1
    updateNodeFields({
      [key]: resNumber,
    })
    event.target.value = resNumber.toString()
  }
}

type OtherPropertyProperties = {
  type: string
  value: string
  NonReactKey: string
  updateNodeFields: (fields: Partial<NodeDataFields>) => void
}

export const OtherProperty: React.FC<OtherPropertyProperties> = ({
  type,
  value,
  NonReactKey,
  updateNodeFields,
}) => {
  return (
    <TextField
      label={NonReactKey}
      variant='outlined'
      type={type}
      value={value}
      {...(type === 'number'
        ? {
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
              onChangeNumber(event, NonReactKey, updateNodeFields)
            },
          }
        : {
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
              updateNodeFields({ [NonReactKey]: event.target.value })
            },
          })}
    ></TextField>
  )
}
