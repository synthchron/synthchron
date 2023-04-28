import { usePersistentStore } from './common/persistentStore'
import { faker } from '@faker-js/faker'
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
import {
  PetriNetProcessModel,
  ProcessModel,
  ProcessModelType,
} from '@synthchron/simulator'
import React from 'react'

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

const examplePetriNetModel: PetriNetProcessModel = {
  type: ProcessModelType.PetriNet,
  acceptingExpressions: [
    {
      name: 'accept',
      expression: 'p3 >= 7',
    },
  ],
  nodes: [
    {
      type: 'place',
      name: 'p1',
      identifier: '1',
      amountOfTokens: 5,
      position: {
        x: -200,
        y: 0,
      },
    },
    {
      type: 'transition',
      name: 'transition 2',
      identifier: '2',
      weight: 1,
      position: {
        x: 0,
        y: 0,
      },
    },
    {
      type: 'place',
      name: 'p3',
      identifier: '3',
      amountOfTokens: 0,
      position: {
        x: 200,
        y: 0,
      },
    },
  ],
  edges: [
    {
      source: '1',
      target: '2',
      multiplicity: 1,
    },
    {
      source: '2',
      target: '3',
      multiplicity: 2,
    },
  ],
}

const NewProjectModal: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
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
        model = examplePetriNetModel
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
    addProject({
      projectName: newProjectConfig.name,
      projectDescription: newProjectConfig.description,
      projectModel: model, // TODO
      created: new Date().toJSON(),
      lastEdited: new Date().toJSON(),
    })
    setNewProjectConfig(newProjectDefault())
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
