import { useEffect, useState } from 'react'

import { TextField } from '@mui/material'

import { Configuration } from '@synthchron/simulator'

import { usePersistentStore } from '../../../common/persistentStore'

interface NameFieldProps {
  name: string
  setName: (name: string) => void
}

const checkError = (
  proxyName: string,
  name: string,
  configurations: Configuration[]
) => {
  if (proxyName == '') {
    return 'Name cannot be empty'
  }

  if (
    proxyName != name &&
    configurations.map((c) => c.configurationName).includes(proxyName)
  ) {
    return 'Name already exists'
  }

  return false
}

export const NameField: React.FC<NameFieldProps> = ({ name, setName }) => {
  const configurations = usePersistentStore((state) => state.configurations)
  const [proxyName, setProxyName] = useState(name)
  useEffect(() => {
    if (proxyName === name) {
      return
    }
    setProxyName(name)
  }, [name])

  useEffect(() => {
    if (proxyName === name) {
      return
    }
    if (!checkError(proxyName, name, configurations)) {
      setName(proxyName)
    }
  }, [proxyName, setName, configurations])

  const error = checkError(proxyName, name, configurations)

  return (
    <TextField
      label='Configuration Name'
      fullWidth
      value={proxyName}
      onChange={(event) => setProxyName(event.target.value)}
      error={error != false}
      helperText={error}
    />
  )
}
