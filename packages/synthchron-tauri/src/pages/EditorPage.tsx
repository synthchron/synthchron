import { useEffect } from 'react'

import { Alert, Box, Snackbar } from '@mui/material'
import { useHotkeys } from 'react-hotkeys-hook'
import { useBeforeUnload, useParams } from 'react-router-dom'
import { ReactFlowProvider, useOnViewportChange, useReactFlow } from 'reactflow'

import { CustomAppBar } from '../components/CustomAppBar'
import { CopyPaste } from '../components/common/CopyPaste'
import { usePersistentStore } from '../components/common/persistentStore'
import { SidebarsWrapper } from '../components/editor/SidebarsWrapper'
import { useEditorStore } from '../components/editor/editorStore/flowStore'
import { petriNetFlowConfig } from '../components/editor/processModels/petriNet/petriNetFlowConfig'

// Wrapper to provide the react flow interface
export const EditorPage = () => (
  <ReactFlowProvider>
    <EditorPageWrapped />
  </ReactFlowProvider>
)

export const EditorPageWrapped = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const open = usePersistentStore((state) => state.saving)
  const doneSaving = usePersistentStore((state) => state.doneSaving)
  const projects = usePersistentStore((state) => state.projects)
  const updateProject = usePersistentStore((state) => state.updateProject)

  const initializeFlow = useEditorStore((state) => state.initializeFlow)
  const saveFlow = useEditorStore((state) => state.saveFlow)
  const sessionStart = useEditorStore((state) => state.sessionStart)
  const setViewport = useEditorStore((state) => state.setViewPort)
  const disconnectRoom = useEditorStore((state) => state.disconnectRoom)

  const reactFlow = useReactFlow()

  // ############# Autosave #############
  useBeforeUnload(() => {
    // This autosaves in case we leave the application without saving
    saveFlow()
  })

  useEffect(
    // This autosaves in case we leave the editor page without saving
    () => () => {
      disconnectRoom()
      saveFlow()
    },
    []
  )

  // ############# Hotkeys #############
  useHotkeys(
    'ctrl+s',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => {
      event.preventDefault()
      if (projectId !== undefined) saveFlow()
    },
    [saveFlow, projectId]
  )

  // ############# Model Initialization #############
  useEffect(() => {
    if (projectId === undefined) return // User has opened the editor window directly
    const processModelConfig = petriNetFlowConfig // TODO: Chose processFlowConfig dynamicly
    const project = projects[projectId]
    if (project === undefined) return // User has opened the editor with an old link
    const { nodes, edges, meta } = processModelConfig.generateFlow(
      project.projectModel
    ) // Get react flow compatible data
    initializeFlow(nodes, edges, meta, processModelConfig, projectId) // Load the flow into zustand

    if (Date.parse(project.lastOpened) < sessionStart + 1000) {
      // If the project was opened before the session started, update the lastOpened date so it is part of the session
      updateProject(projectId, { lastOpened: new Date().toJSON() })
    }

    if (project.projectModel.viewPort !== undefined) {
      // If there is a saved viewport, load it
      reactFlow.setViewport(project.projectModel.viewPort)
      setViewport(project.projectModel.viewPort)
    }
  }, [projectId])

  useOnViewportChange({ onEnd: setViewport }) // Store the viewport, for saving it later

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
