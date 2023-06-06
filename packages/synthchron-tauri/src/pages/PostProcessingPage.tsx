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
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[] | null>(
    null
  )
  const [traceText, setTraceText] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const uploadFile = useCallback(
    (acceptedFiles: File[]) => {
      // The check is done here instead of the dropzone component
      // in order to display a more specific error message
      acceptedFiles.forEach((file) => {
        if (!file.name.endsWith('.xes')) {
          setErrorMessage('File must be a .xes file')
          throw file.name + ' was not a .xes file'
        }
      })

      acceptedFiles.forEach((file) => {
        if (
          !uploadedFiles?.some((loadedFile) => loadedFile.name === file.name)
        ) {
          const reader = new FileReader()
          reader.onload = function () {
            setUploadedFiles((prevUploadedFiles) => {
              const newUploadedFile = {
                name: file.name,
                content: reader.result as string,
              }
              return prevUploadedFiles
                ? [...prevUploadedFiles, newUploadedFile]
                : [newUploadedFile]
            })
          }
          reader.readAsText(file)
        }
      })
      console.log(uploadedFiles) //REMOVE
    },
    [uploadedFiles]
  )

  const reset = () => {
    console.log(uploadedFiles) //REMOVE
    setUploadedFiles(null)
    setTraceText('')
    setErrorMessage('')
  }
  return (
    <>
      <CustomAppBar />

      <Box
        sx={{
          width: '100%',
          maxWidth: ['95%', '95%', '95%', '95%'],
          margin: '2em auto',
        }}
      >
        <Grid container style={{ height: 'calc(100vh - 70px)' }} spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ padding: '1em' }}>
              <Box style={{ minHeight: '100%' }}>
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
                      uploadedFiles !== null
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
                      value={traceText}
                      label='Paste your log here'
                      sx={{
                        flexGrow: 1,
                        alignItems: 'flex-start',
                        maxHeight: '50vh',
                      }}
                      onChange={(event) => {
                        setTraceText(event.target.value)
                      }}
                      disabled={uploadedFiles !== null}
                    />
                  </Tooltip>
                </Box>
                <Box>
                  <Typography variant='h6' align='center'>
                    Or upload file
                  </Typography>
                  <Dropzone onDrop={uploadFile} disabled={traceText !== ''}>
                    {({ getRootProps, getInputProps, isDragActive }) => (
                      <div {...getRootProps()}>
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
                  <Box textAlign='center' sx={{ marginTop: '1em' }}>
                    <Button variant='contained' color='primary' onClick={reset}>
                      Reset
                    </Button>
                  </Box>
                  {uploadedFiles !== null && (
                    <Box sx={{ backgroundColor: 'lightgreen', padding: '5px' }}>
                      <Typography variant='body1'>
                        Successfully uploaded file: {uploadedFiles[0].name}{' '}
                        {/*FIX*/}
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
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <Box sx={{ minHeight: '100%', marginLeft: 'auto' }}>
                <PostprocessingPanel
                  postprocessing={postprocessing}
                  setPostprocessing={setPostprocessing}
                />
                <Button
                  sx={{ marginTop: '1em' }}
                  variant='contained'
                  color='primary'
                  fullWidth
                  onClick={() => {
                    const trace =
                      uploadedFiles !== null
                        ? uploadedFiles[0].content //FIX
                        : traceText
                    exportStringAsFile(
                      postProcessXESFile(trace, postprocessing),
                      'postProcessedEventLog.xes'
                    )
                  }}
                  disabled={traceText === '' && uploadedFiles === null}
                >
                  Post Process and Generate XES
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
