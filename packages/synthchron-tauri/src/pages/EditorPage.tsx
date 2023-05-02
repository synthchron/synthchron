import { useEffect } from 'react'

import { Alert, Box, Snackbar } from '@mui/material'
import _ from 'lodash'
import { useHotkeys } from 'react-hotkeys-hook'
import { useParams } from 'react-router-dom'

import { CustomAppBar } from '../components/CustomAppBar'
import { usePersistentStore } from '../components/common/persistentStore'
import { SidebarsWrapper } from '../components/editor/SidebarsWrapper'
import { useEditorStore } from '../components/editor/editorStore/flowStore'
import { petriNetFlowConfig } from '../components/editor/processModels/petriNet/petriNetFlowConfig'

export const EditorPage = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const open = usePersistentStore((state) => state.saving)
  const doneSaving = usePersistentStore((state) => state.doneSaving)
  const projects = usePersistentStore((state) => state.projects)

  const initializeFlow = useEditorStore((state) => state.initializeFlow)
  const saveFlow = useEditorStore((state) => state.saveFlow)

  useHotkeys(
    'ctrl+s',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => {
      event.preventDefault()
      if (projectId !== undefined) saveFlow()
    },
    [saveFlow, projectId]
  )

  useEffect(() => {
    if (projectId === undefined) return // User has opened the editor window directly
    const processModelConfig = petriNetFlowConfig // TODO: Chose processFlowConfig dynamicly
    const { nodes, edges, meta } = processModelConfig.generateFlow(
      projects[projectId].projectModel
    )
    initializeFlow(nodes, edges, meta, processModelConfig, projectId)
  }, [projectId])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
      }}
    >
      <CustomAppBar />
      {projectId !== undefined && projects[projectId] === undefined ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
          }}
        >
          <Alert severity='error'>Project with id {projectId} not found</Alert>
        </Box>
      ) : (
        <SidebarsWrapper />
      )}
      <Snackbar
        open={open}
        autoHideDuration={1000}
        onClose={() => doneSaving()}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={doneSaving} severity='success' sx={{ width: '100%' }}>
          Model saved
        </Alert>
      </Snackbar>
    </Box>
  )
}
