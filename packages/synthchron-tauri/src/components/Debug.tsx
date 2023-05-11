import { Button } from '@mui/material'
import { SplitPane } from 'react-collapse-pane'
import { Offline, Online } from 'react-detect-offline'

import { CustomAppBar } from './CustomAppBar'
import { usePersistentStore } from './common/persistentStore'

export const Debug = () => {
  const projects = usePersistentStore((state) => state.projects)
  const removeProject = usePersistentStore((state) => state.removeProject)

  return (
    <>
      <SplitPane split='vertical' collapse={true}>
        <div>This is the first div</div>
        <div>This is the second div</div>
        <div>This is the third div</div>
        This is the fourth but not a div!
      </SplitPane>
    </>
  )
}
