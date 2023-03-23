import {
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material'
import { flowchart1, petriNet1, ProcessModel } from '@synthchron/simulator'
import { usePersistentStore } from '../components/common/persistentStore'
import { CustomAppBar } from '../components/CustomAppBar'
import { ProjectCard } from '../components/ProjectCard'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { faker } from '@faker-js/faker'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import React from 'react'

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

export enum ProcessModelType {
  PetriNet = 'petri-net',
  Flowchart = 'flowchart',
  DcrGraph = 'dcr-graph',
}

export type ProjectConfig = {
  name: string
  description: string
  modelType: ProcessModelType
}

export const MainMenuPage = () => {
  const projects = usePersistentStore((state) => state.projects)
  const addProject = usePersistentStore((state) => state.addProject)

  // Modal things
  const [modal_open, modal_setOpen] = React.useState(false)
  const handleOpen = () => modal_setOpen(true)
  const handleClose = () => modal_setOpen(false)

  const newProjectDefault = () => {
    return {
      name: faker.animal.bird(),
      description: '',
      modelType: ProcessModelType.PetriNet,
    }
  }
  const [newProjectConfig, setNewProjectConfig] = React.useState(
    newProjectDefault()
  )
  const updateNewProjectConfig = (fields: Partial<ProjectConfig>) => {
    setNewProjectConfig({ ...newProjectConfig, ...fields })
  }

  return (
    <>
      <CustomAppBar />
      <Grid sx={{ flexGrow: 1 }} container spacing={2}>
        <Grid
          item
          sx={{
            xs: 12,
            height: 20,
          }}
        />
        <Grid item justifyContent={'center'} xs={12}>
          <Grid container justifyContent={'center'} spacing={2}>
            <Grid item xs={9}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <IconButton
                    color='primary'
                    aria-label='add to shopping cart'
                    onClick={handleOpen}
                  >
                    <AddCircleIcon fontSize='large' />
                  </IconButton>
                </Grid>
                {Object.entries(projects)
                  .sort(([, p1], [, p2]) => {
                    return Date.parse(p1.lastEdited) - Date.parse(p2.lastEdited)
                  })
                  .reverse()
                  .map(([k, v], i) => (
                    <Grid key={i} item xs={4}>
                      <ProjectCard projectId={k} project={v} />
                    </Grid>
                  ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Modal
        open={modal_open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box component='form' sx={modal_style} noValidate autoComplete='off'>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            New project
          </Typography>
          <Stack spacing={2} direction='column' sx={{ mb: 1 }}>
            <TextField
              required
              error
              id='new-project-name'
              label='Project name'
              defaultValue={newProjectConfig.name}
              variant='standard'
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                updateNewProjectConfig({ name: event.target.value })
              }}
            />
            <FormControl fullWidth>
              <InputLabel id='new-project-model-label'>
                Process model type
              </InputLabel>
              <Select
                labelId='new-project-model-label'
                id='new-project-model'
                value={newProjectConfig.modelType}
                label='Age'
                onChange={(event: SelectChangeEvent) => {
                  updateNewProjectConfig({
                    modelType: event.target.value as ProcessModelType,
                  })
                }}
              >
                <MenuItem value={ProcessModelType.PetriNet}>Petri Net</MenuItem>
                <MenuItem value={ProcessModelType.Flowchart}>
                  Flowchart
                </MenuItem>
                <MenuItem value={ProcessModelType.DcrGraph}>Dcr Graph</MenuItem>
              </Select>
            </FormControl>
            <TextField
              id='new-project-description'
              label='Description'
              defaultValue={newProjectConfig.description}
              variant='standard'
              multiline
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                updateNewProjectConfig({ description: event.target.value })
              }}
            />
            <Button
              color='primary'
              variant='contained'
              onClick={() => {
                let model: ProcessModel
                switch (newProjectConfig.modelType) {
                  case ProcessModelType.PetriNet:
                    model = petriNet1
                    break
                  case ProcessModelType.Flowchart:
                    model = flowchart1
                    break
                  default:
                    model = petriNet1 // TODO
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
                handleClose()
              }}
            >
              Create project
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  )
}
