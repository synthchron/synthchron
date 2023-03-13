import { Box } from '@mui/material'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { usePersistentStore } from '../components/common/persistentStore'
import { CustomAppBar } from '../components/CustomAppBar'
import { DragAndDropWrapper } from '../components/react-flow/DragAndDropWrapper'
import { useFlowStore } from '../components/react-flow/ydoc/flowStore'
import { petriNetFlowConfig } from '../components/react-flow/processModels/petriNet/petriNetFlowConfig'

export const EditorPage = () => {
  const { projectId } = useParams<{ projectId: string }>()

  const initializeFlow = useFlowStore((state) => state.initializeFlow)
  const projects = usePersistentStore((state) => state.projects)

  useEffect(() => {
    if (projectId === undefined) return // User has opened the editor window directly
    const processModelConfig = petriNetFlowConfig // TODO: Chose processFlowConfig dynamicly
    const { nodes, edges } = processModelConfig.generateFlow(
      projects[projectId].projectModel
    )
    initializeFlow(nodes, edges, processModelConfig)
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
      <DragAndDropWrapper />
    </Box>
  )
}
