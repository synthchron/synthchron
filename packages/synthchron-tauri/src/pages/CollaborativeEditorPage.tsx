import { Box } from '@mui/material'
import { CustomAppBar } from '../components/CustomAppBar'
import { DragAndDropWrapper } from '../components/react-flow/DragAndDropWrapper'

export const CollaborativeEditorPage = () => {
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
