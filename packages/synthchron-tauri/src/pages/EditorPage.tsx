import { useEffect } from 'react'

import { Alert, Box, Snackbar } from '@mui/material'
import _ from 'lodash'
import { useHotkeys } from 'react-hotkeys-hook'
import { unstable_usePrompt, useParams } from 'react-router-dom'

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
  const getProcessModel = useEditorStore((state) => state.getProcessModel)

  unstable_usePrompt({
    // The following lines are needed because the types for unstable_usePrompt are wrong.
    // They claim to only take a boolean, but can actually take a function that returns a boolean.

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    when: () =>
      projectId !== undefined &&
      !_.isEqual(projects[projectId].projectModel, getProcessModel()),
    message: 'You have unsaved changes, are you sure you want to leave?',
  })

  useHotkeys(
    'ctrl+s',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => {
      event.preventDefault()
      if (projectId !== undefined) saveFlow(projectId)
    },
    [saveFlow, projectId]
  )

  useEffect(() => {
    if (projectId === undefined) return // User has opened the editor window directly
    const processModelConfig = petriNetFlowConfig // TODO: Chose processFlowConfig dynamicly
    const { nodes, edges, meta } = processModelConfig.generateFlow(
      projects[projectId].projectModel
    )
    initializeFlow(nodes, edges, meta, processModelConfig)
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
