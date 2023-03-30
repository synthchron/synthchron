import { Alert, Box, Snackbar } from '@mui/material'
import { useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useParams } from 'react-router-dom'
import { usePersistentStore } from '../components/common/persistentStore'
import { CustomAppBar } from '../components/CustomAppBar'
import { SidebarsWrapper } from '../components/react-flow/SidebarsWrapper'
import { useEditorStore } from '../components/react-flow/flowStore/flowStore'
import { petriNetFlowConfig } from '../components/react-flow/processModels/petriNet/petriNetFlowConfig'

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
      <SidebarsWrapper />
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
