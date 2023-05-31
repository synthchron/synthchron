import { BaseSyntheticEvent, useState } from 'react'

import { faker } from '@faker-js/faker'
import {
  Box,
  Button,
  Input,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { ProcessModel, ProcessModelType } from '@synthchron/simulator'

import { usePersistentStore } from './common/persistentStore'

export type ProjectConfig = {
  name: string
  description: string
  modelType: ProcessModelType
}

interface NewFileProjectProps {
  onClose: () => void
  redirect?: boolean
}

const NewProjectFile: React.FC<NewFileProjectProps> = ({
  onClose,
  redirect = false,
}) => {
  const navigate = useNavigate()
  const [processModelSet, setProcessModelSet] = useState(false)
  const [fileInputClass, setFileInputClass] = useState('')
  const [fileErrors, setFileErrors] = useState<string>('')
  const [processModel, setProcessModel] = useState({
    type: ProcessModelType.PetriNet,
    nodes: [],
    edges: [],
    acceptingExpressions: [],
  } as ProcessModel)

  const addProject = usePersistentStore((state) => state.addProject)

  const newProjectDefault = () => {
    return {
      name: faker.animal.bird(),
      description: '',
      modelType: ProcessModelType.PetriNet,
    }
  }

  const [newProjectConfig, setNewProjectConfig] = useState<ProjectConfig>(
    newProjectDefault()
  )

  const updateNewProjectConfig = (fields: Partial<ProjectConfig>) => {
    setNewProjectConfig({ ...newProjectConfig, ...fields })
  }

  const createNewProject = () => {
    if (!processModelSet) {
      setFileInputClass('Mui-error')
      return
    }

    const projectId = addProject({
      projectName: newProjectConfig.name,
      projectDescription: newProjectConfig.description,
      projectModel: processModel,
      created: new Date().toJSON(),
      lastEdited: new Date().toJSON(),
      lastOpened: (redirect ? new Date() : new Date(0)).toJSON(),
    })

    setNewProjectConfig(newProjectDefault())
    if (redirect) navigate(`/editor/${projectId}`)
    onClose()
  }

  const readFile = (file: File) => {
    file.text().then((res: string) => {
      try {
        const json: ProcessModel = JSON.parse(res) as ProcessModel
        if (json != null) {
          setFileErrors('')
          setProcessModel(json)
          setProcessModelSet(true)
        }
      } catch (e) {
        setFileErrors('Could not parse the file as a process model.')
        console.log(e)
      }
    })
  }

  return (
    <Box
      component='form'
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
        <TextField
          id='new-project-description'
          label='Description'
          multiline
          value={newProjectConfig.description}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            updateNewProjectConfig({ description: event.target.value })
          }}
        />
        <Input
          type='file'
          className={fileInputClass}
          onChange={(e: BaseSyntheticEvent) => {
            if (e.target.files != null && e.target.files.length > 0)
              readFile(e.target.files[0])
          }}
        ></Input>
        <InputLabel
          style={{
            color: 'red',
          }}
        >
          {fileErrors}
        </InputLabel>
        <Button type='submit' color='primary' variant='contained'>
          Create
        </Button>
      </Stack>
    </Box>
  )
}

export default NewProjectFile
