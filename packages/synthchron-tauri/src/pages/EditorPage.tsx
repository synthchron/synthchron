import { Box } from '@mui/material'
import { useParams } from 'react-router-dom'
import { CustomAppBar } from '../components/CustomAppBar'
import { DragAndDropWrapper } from '../components/react-flow/Flow'

export const EditorPage = () => {
  const { projectId } = useParams<{ projectId: string }>()

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
      <div>{projectId}</div>
      <DragAndDropWrapper />
    </Box>
  )
}
