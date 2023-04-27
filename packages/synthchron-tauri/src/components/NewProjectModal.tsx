import React from 'react'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { ProcessModel, ProcessModelType } from '@synthchron/simulator'
import { faker } from '@faker-js/faker'
import { usePersistentStore } from './common/persistentStore'
import { useNavigate } from 'react-router-dom'

export type ProjectConfig = {
  name: string
  description: string
  modelType: ProcessModelType
}

const modal_style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '.3rem',
  boxShadow: 14,
  p: 4,
}

interface NewProjectModalProps {
  open: boolean
  onClose: () => void
  redirect?: boolean
}

const NewProjectModal: React.FC<NewProjectModalProps> = ({
  open,
  onClose,
  redirect = false,
}) => {
  const navigate = useNavigate()

  const addProject = usePersistentStore((state) => state.addProject)

  const newProjectDefault = () => {
    return {
      name: faker.animal.bird(),
      description: '',
      modelType: ProcessModelType.PetriNet,
    }
  }

  const [newProjectConfig, setNewProjectConfig] = React.useState<ProjectConfig>(
    newProjectDefault()
  )

  const updateNewProjectConfig = (fields: Partial<ProjectConfig>) => {
    setNewProjectConfig({ ...newProjectConfig, ...fields })
  }

  const createNewProject = () => {
    let model: ProcessModel
    switch (newProjectConfig.modelType) {
      default:
      case ProcessModelType.PetriNet:
        model = {
          type: newProjectConfig.modelType,
          acceptingExpressions: [],
          nodes: [],
          edges: [],
        }
        break
      case ProcessModelType.DcrGraph:
        model = { type: newProjectConfig.modelType, nodes: [], edges: [] }
        break
      case ProcessModelType.Flowchart:
        model = {
          type: newProjectConfig.modelType,
          nodes: [
            {
              type: 'decision',
              identifier: 'startNode',
            },
          ],
          edges: [],
          initialNode: 'startNode',
        }
        break
    }
    const projectId = addProject({
      projectName: newProjectConfig.name,
      projectDescription: newProjectConfig.description,
      projectModel: model, // TODO
      created: new Date().toJSON(),
      lastEdited: new Date().toJSON(),
    })
    setNewProjectConfig(newProjectDefault())
    if (redirect) navigate(`/editor/${projectId}`)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box
        component='form'
        sx={modal_style}
        noValidate
        onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          createNewProject()
        }}
      >
        <Typography
          id='modal-modal-title'
          variant='h5'
          sx={{ marginBottom: '2rem' }}
        >
          New project
        </Typography>
        <Stack spacing={4} direction='column'>
          <TextField
            required
            id='new-project-name'
            label='Project name'
            variant='standard'
            value={newProjectConfig.name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              updateNewProjectConfig({ name: event.target.value })
            }}
          />
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Model Type</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='new-project-model'
              label='Process Model Type'
              value={newProjectConfig.modelType}
              onChange={(event: SelectChangeEvent) => {
                updateNewProjectConfig({
                  modelType: event.target.value as ProcessModelType,
                })
              }}
            >
              <MenuItem value={ProcessModelType.PetriNet}>Petri Net</MenuItem>
              <MenuItem value={ProcessModelType.Flowchart}>Flowchart</MenuItem>
              <MenuItem value={ProcessModelType.DcrGraph}>Dcr Graph</MenuItem>
            </Select>
          </FormControl>

          <TextField
            id='new-project-description'
            label='Description'
            multiline
            value={newProjectConfig.description}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              updateNewProjectConfig({ description: event.target.value })
            }}
          />
          <Button type='submit' color='primary' variant='contained'>
            Create
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
}

export default NewProjectModal
