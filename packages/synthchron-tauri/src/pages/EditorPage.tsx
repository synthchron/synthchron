import { Box } from '@mui/material'
import { CustomAppBar } from '../components/CustomAppBar'
import Flow from '../components/Flow'

export const EditorPage = () => {
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
      <Flow />
    </Box>
  )
}
