import { Box, Button, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useFlowStore } from '../ydoc/flowStore'

export const ProjectTab: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()

  const saveFlow = useFlowStore((state) => state.saveFlow)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: '10px',
      }}
    >
      <Typography variant='h6'>Project</Typography>
      <Button
        onClick={() => {
          if (projectId) {
            saveFlow(projectId)
          } else {
            console.log('No project id') // TODO: Create project
          }
        }}
      >
        Save
      </Button>
    </Box>
  )
}
