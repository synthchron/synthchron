import { useCallback, useState } from 'react'

import AddIcon from '@mui/icons-material/Add'
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import Dropzone, { useDropzone } from 'react-dropzone'

import { PostprocessingConfiguration } from '@synthchron/types'

import { CustomAppBar } from '../components/CustomAppBar'
import PostprocessingPanel from '../components/editor/bottomDrawer/postprocessingPanel/PostprocessingPanel'

const defaultPostprocessing: PostprocessingConfiguration = {
  stepProbability: 0.1,
  postProcessingSteps: [],
}

const postProcess = (file: unknown, text: string) => {
  console.log('Post processing')
  console.log(file)
  console.log(text)
}

export const PostProcessingPage = () => {
  const [postprocessing, setPostprocessing] = useState(defaultPostprocessing)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [traceText, setTraceText] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const uploadFile = useCallback((acceptedFiles: File[]) => {
    reset()
    // The check is done here instead of the dropzone component
    // in order to display a more specific error message
    if (acceptedFiles.length > 1) {
      setErrorMessage('Only one file can be uploaded at a time')
      return
    }
    const file = acceptedFiles[0]
    if (!file.name.endsWith('.xes')) {
      setErrorMessage('File must be a .xes file')
      return
    }
    const reader = new FileReader()
    reader.onload = function () {
      setUploadedFile(file)
    }
    reader.readAsText(file)
  }, [])

  const reset = () => {
    setUploadedFile(null)
    setTraceText('')
    setErrorMessage('')
  }
  return (
    <>
      <CustomAppBar />
      <Grid container style={{ height: 'calc(100vh - 70px)' }}>
        <Grid item xs={12} md={6}>
          <Paper style={{ minHeight: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '45%',
                overflow: 'auto',
                marginBottom: '10px',
              }}
            >
              <Typography variant='h6'>Paste your log here</Typography>
              <TextField
                multiline
                fullWidth
                maxRows={10}
                sx={{
                  flexGrow: 1,
                  alignItems: 'flex-start',
                  maxHeight: '50vh',
                }}
                onChange={(event) => {
                  setTraceText(event.target.value)
                }}
                disabled={uploadedFile !== null}
              />
            </Box>
            <Box>
              <Typography variant='h6'>Or upload file</Typography>
              <Dropzone onDrop={uploadFile}>
                {({ getRootProps, getInputProps, isDragActive }) => (
                  <div {...getRootProps()} style={{ backgroundColor: 'grey' }}>
                    <input {...getInputProps()} disabled={traceText !== ''} />
                    <Tooltip title='Drop / Select file' arrow placement='left'>
                      <Paper
                        style={{
                          minHeight: 250,
                          height: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor:
                            traceText !== ''
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
              <Button variant='contained' color='primary' onClick={reset}>
                Reset
              </Button>
              {uploadedFile !== null && (
                <Typography variant='body1'>
                  <Box sx={{ backgroundColor: 'lightgreen', padding: '5px' }}>
                    Successfully uploaded file: {uploadedFile.name}
                  </Box>
                </Typography>
              )}
              {errorMessage != '' && (
                <Typography variant='body1'>
                  <Box sx={{ backgroundColor: 'red', padding: '5px' }}>
                    {errorMessage}
                  </Box>
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ minHeight: '100%', marginLeft: 'auto' }}>
            <PostprocessingPanel
              postprocessing={postprocessing}
              setPostprocessing={setPostprocessing}
            />
            <Button
              variant='contained'
              color='primary'
              fullWidth
              onClick={() => {
                postProcess(uploadedFile, traceText)
              }}
              disabled={traceText === '' && uploadedFile === null}
            >
              Post Process and Generate XES
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}
