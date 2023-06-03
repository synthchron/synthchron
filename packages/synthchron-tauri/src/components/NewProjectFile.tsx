import { useCallback, useState } from 'react'

import { faker } from '@faker-js/faker'
import AddIcon from '@mui/icons-material/Add'
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import Dropzone from 'react-dropzone'
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

type UploadedFile = {
  name: string
  content: string
}

const NewProjectFile: React.FC<NewFileProjectProps> = ({
  onClose,
  redirect = false,
}) => {
  const navigate = useNavigate()
  const [fileErrors, setFileErrors] = useState<string>('')
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [processModel, setProcessModel] = useState<ProcessModel | null>(null)

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
    if (!uploadedFile == null) {
      setFileErrors('A file is needed.')
      return
    }

    if (processModel == null) {
      setFileErrors('The file couldnt parse to a process mdoel.')
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

  const uploadFile = useCallback((acceptedFiles: File[]) => {
    reset()
    // The check is done here instead of the dropzone component
    // in order to display a more specific error message
    if (acceptedFiles.length > 1) {
      setFileErrors('Only one file can be uploaded at a time')
      return
    }
    const file = acceptedFiles[0]
    if (!file.name.endsWith('.json')) {
      setFileErrors('File must be a .json file')
      return
    }
    const reader = new FileReader()
    reader.onload = function () {
      const result: string = reader.result as string

      try {
        const json: ProcessModel = JSON.parse(result) as ProcessModel

        if (json.type != null) {
          setProcessModel(json)
          setUploadedFile({ name: file.name, content: result })
        } else {
          setFileErrors('The file couldnt parse to a process model.')
        }
      } catch (error) {
        setFileErrors('Couldnt read file as json.')
      }
    }
    reader.readAsText(file)
  }, [])
  const reset = () => {
    setUploadedFile(null)
    setProcessModel(null)
    setFileErrors('')
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

        <Dropzone onDrop={uploadFile} disabled={processModel !== null}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div {...getRootProps()} style={{ backgroundColor: 'grey' }}>
              <input {...getInputProps()} />
              <Tooltip
                title={
                  processModel === null
                    ? 'Drop / Select file'
                    : 'Disabled while a process model is selected for import'
                }
                arrow
                placement='left'
              >
                <Paper
                  style={{
                    minHeight: 150,
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor:
                      processModel !== null
                        ? 'gray'
                        : isDragActive
                        ? 'lightgray'
                        : 'whitesmoke',
                    cursor: 'pointer',
                  }}
                >
                  <IconButton>
                    <AddIcon fontSize='large' />
                  </IconButton>
                </Paper>
              </Tooltip>
            </div>
          )}
        </Dropzone>

        {processModel !== null && uploadedFile !== null && (
          <Box sx={{ backgroundColor: 'lightgreen', padding: '5px' }}>
            <Typography variant='body1'>
              Successfully uploaded file: {uploadedFile.name}
            </Typography>
          </Box>
        )}
        {fileErrors != '' && (
          <Typography variant='body1'>
            <Box sx={{ backgroundColor: 'red', padding: '5px' }}>
              {fileErrors}
            </Box>
          </Typography>
        )}
        <Button variant='contained' color='primary' onClick={reset}>
          Remove import
        </Button>
        <Button type='submit' color='primary' variant='contained'>
          Create
        </Button>
      </Stack>
    </Box>
  )
}

export default NewProjectFile
