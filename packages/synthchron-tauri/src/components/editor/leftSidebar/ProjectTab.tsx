import { useCallback } from 'react'

import { faker } from '@faker-js/faker'
import {
  Box,
  Button,
  Container,
  Input,
  TextField,
  Typography,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { shallow } from 'zustand/shallow'

import { transformFlowToSimulator } from '../../../utils/flowTransformer'
import {
  PersistentState,
  usePersistentStore,
} from '../../common/persistentStore'
import { useEditorStore } from '../editorStore/flowStore'

export const ProjectTab: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()

  const saveFlow = useEditorStore((state) => state.saveFlow)

  const selector = useCallback(
    (state: PersistentState) => ({
      projects: state.projects,
      addProject: state.addProject,
      updateProject: state.updateProject,
    }),
    []
  )
  const { projects, addProject, updateProject } = usePersistentStore(
    selector,
    shallow
  )

  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: '10px',
        width: '100%',
      }}
    >
      <Container>
        <Typography variant='h6'>Project</Typography>

        <Box
          sx={{
            marginTop: '1em',
            marginBottom: '1em',
          }}
        >
          <TextField
            label='Project Name'
            value={projectId && projects[projectId].projectName}
            onChange={(val) => {
              if (projectId)
                updateProject(projectId, {
                  projectName: val.target.value,
                })
            }}
            multiline
            maxRows={4}
            fullWidth
            disabled={projectId === undefined}
          />
        </Box>

        <Box
          sx={{
            marginTop: '2em',
            marginBottom: '1em',
          }}
        >
          <TextField
            label='Project Description'
            value={projectId && projects[projectId].projectDescription}
            onChange={(val) => {
              if (projectId)
                updateProject(projectId, {
                  projectDescription: val.target.value,
                })
            }}
            multiline
            fullWidth
            disabled={projectId === undefined}
          />
        </Box>

        <Button
          onClick={() => {
            if (projectId) {
              saveFlow()
            } else {
              const processModel = transformFlowToSimulator(
                useEditorStore.getState()
              )
              const id = addProject({
                projectName: faker.animal.cow(),
                projectDescription: faker.lorem.lines(3),
                projectModel: processModel,
                created: new Date().toJSON(),
                lastEdited: new Date().toJSON(),
                lastOpened: new Date(0).toJSON(),
              })

              navigate(`/editor/${id}`)
            }
          }}
        >
          Save
        </Button>
      </Container>
    </Box>
  )
}
