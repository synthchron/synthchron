import { Button } from '@mui/material'
import { Offline, Online } from 'react-detect-offline'

import { CustomAppBar } from './CustomAppBar'
import { usePersistentStore } from './common/persistentStore'

export const Debug = () => {
  const projects = usePersistentStore((state) => state.projects)
  const removeProject = usePersistentStore((state) => state.removeProject)
  const setConfigurations = usePersistentStore(
    (state) => state.setConfigurations
  )

  return (
    <>
      <CustomAppBar />
      Hello World! You are{' '}
      <i>
        <Online>online</Online>
        <Offline>offline</Offline>
      </i>
      <Button
        onClick={() => {
          // Remove all projects
          Object.keys(projects).forEach((k) => removeProject(k))
        }}
      >
        Remove all projects
      </Button>
      <Button
        onClick={() => {
          // Remove all configs
          setConfigurations([])
        }}
      >
        Remove all configurations
      </Button>
    </>
  )
}
