import { useCallback } from 'react'

import { faker } from '@faker-js/faker'
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { shallow } from 'zustand/shallow'

import { transformFlowToSimulator } from '../../../utils/flowTransformer'
import {
  PersistentState,
  usePersistentStore,
} from '../../common/persistentStore'
import { useEditorStore } from '../editorStore/flowStore'
import { CollaborationTab } from './CollaborationTab'
import { CreatorTab } from './CreatorTab'

export const ProjectTab: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()

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
    <Box sx={{ padding: '10px' }}>
      <Stack spacing={1}>
        <Paper
          sx={{
            padding: '16px',
          }}
        >
          <Stack spacing={1}>
            <Typography variant='h6' gutterBottom>
              Project
            </Typography>

            {projectId ? (
              <>
                <TextField
                  label='Project Name'
                  size='small'
                  value={projectId && projects[projectId].projectName}
                  onChange={(val) => {
                    if (projectId)
                      updateProject(projectId, {
                        projectName: val.target.value,
                      })
                  }}
                  maxRows={4}
                  fullWidth
                  disabled={projectId === undefined}
                />

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
                  minRows={3}
                />
              </>
            ) : (
              <>
                <Typography variant='caption' gutterBottom>
                  This is a remote project. Create a local copy to persist it.
                  (You will leave the collaboration session)
                </Typography>

                <Button
                  onClick={() => {
                    const processModel = transformFlowToSimulator(
                      useEditorStore.getState()
                    )
                    const id = addProject({
                      projectName: faker.animal.cow() + ' (local copy)',
                      projectDescription: '',
                      projectModel: processModel,
                      created: new Date().toJSON(),
                      lastEdited: new Date().toJSON(),
                      lastOpened: new Date(0).toJSON(),
                    })

                    navigate(`/editor/${id}`)
                  }}
                >
                  Create local copy
                </Button>
              </>
            )}
          </Stack>
        </Paper>

        <CreatorTab />

        <CollaborationTab />
      </Stack>
    </Box>
  )
}
