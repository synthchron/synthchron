import { faker } from '@faker-js/faker'
import { Box, Button, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { usePersistentStore } from '../../common/persistentStore'
import { transformFlowToSimulator } from '../../flowTransformer'
import { useFlowStore } from '../ydoc/flowStore'

export const ProjectTab: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()

  const saveFlow = useFlowStore((state) => state.saveFlow)

  const addProject = usePersistentStore((state) => state.addProject)

  const navigate = useNavigate()

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
            const processModel = transformFlowToSimulator(
              useFlowStore.getState()
            )
            const id = addProject({
              projectName: faker.animal.cow(),
              projectDescription: faker.lorem.lines(3),
              projectModel: processModel,
              created: new Date().toJSON(),
              lastEdited: new Date().toJSON(),
            })

            navigate(`/editor/${id}`)
          }
        }}
      >
        Save
      </Button>
    </Box>
  )
}
