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
import Dropzone from 'react-dropzone'

import { postprocess } from '@synthchron/postprocessor'
import { SimulationLog } from '@synthchron/simulator'
import { PostprocessingConfiguration } from '@synthchron/types'
import {
  exportStringAsFile,
  transformSimulationLogToXESLog,
  transformXESLogToSimulationLog,
} from '@synthchron/utils'
import { deserialize, serialize } from '@synthchron/xes'

import { CustomAppBar } from '../components/CustomAppBar'
import PostprocessingPanel from '../components/editor/bottomDrawer/postprocessingPanel/PostprocessingPanel'

const defaultPostprocessing: PostprocessingConfiguration = {
  stepProbability: 0.1,
  postProcessingSteps: [],
}

const postProcessXESFile = (
  trace: string,
  postProcessing: PostprocessingConfiguration
): string => {
  const xesLog = deserialize(trace)
  const simulationLog = transformXESLogToSimulationLog(xesLog)
  const processedLog: SimulationLog = {
    simulationResults: simulationLog.simulationResults.map((traceResult) => ({
      trace: postprocess(traceResult.trace, postProcessing, ''),
    })),
  }
  const processedXESLog = transformSimulationLogToXESLog(processedLog)
  return serialize(processedXESLog)
}

type UploadedFile = {
  name: string
  content: string
}

export const PostProcessingPage = () => {
  const [postprocessing, setPostprocessing] = useState(defaultPostprocessing)
  const [uploadedTrace, setUploadedFile] = useState<UploadedFile | null>(null)
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
      setUploadedFile({ name: file.name, content: reader.result as string })
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
              <Typography variant='h6' align={'center'}>
                Paste your log here
              </Typography>
              <Tooltip
                title={
                  uploadedTrace !== null
                    ? 'Disabled while there is an uploaded file'
                    : ''
                }
                arrow
                placement='left'
              >
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
                  disabled={uploadedTrace !== null}
                />
              </Tooltip>
            </Box>
            <Box>
              <Typography variant='h6' align='center'>
                Or upload file
              </Typography>
              <Dropzone onDrop={uploadFile} disabled={traceText !== ''}>
                {({ getRootProps, getInputProps, isDragActive }) => (
                  <div {...getRootProps()} style={{ backgroundColor: 'grey' }}>
                    <input {...getInputProps()} />
                    <Tooltip
                      title={
                        traceText === ''
                          ? 'Drop / Select file'
                          : 'Disabled while there is input in the text field above'
                      }
                      arrow
                      placement='left'
                    >
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
              {uploadedTrace !== null && (
                <Box sx={{ backgroundColor: 'lightgreen', padding: '5px' }}>
                  <Typography variant='body1'>
                    Successfully uploaded file: {uploadedTrace.name}
                  </Typography>
                </Box>
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
                const trace =
                  uploadedTrace !== null ? uploadedTrace.content : traceText
                exportStringAsFile(
                  postProcessXESFile(trace, postprocessing),
                  'postProcessedEventLog.xes'
                )
              }}
              disabled={traceText === '' && uploadedTrace === null}
            >
              Post Process and Generate XES
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}
