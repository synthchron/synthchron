import { CustomAppBar } from './CustomAppBar'
import { Offline, Online } from 'react-detect-offline'
import { Button } from '@mui/material'
import { usePersistentStore } from './common/persistentStore'

export const Debug = () => {
  const projects = usePersistentStore((state) => state.projects)
  const removeProject = usePersistentStore((state) => state.removeProject)

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
    </>
  )
}
