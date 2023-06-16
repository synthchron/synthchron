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
import JSZip from 'jszip'
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
import { PostprocessingPanel } from '../components/editor/bottomDrawer/postprocessingPanel/PostprocessingPanel'

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
      // Error checks are done here instead of the dropzone component
      // in order to display more specific error messages
      setErrorMessage('')
      acceptedFiles.forEach((file) => {
        if (file.name.endsWith('.xes')) {
          const reader = new FileReader()
          reader.onload = function () {
            if (
              !uploadedFiles ||
              !uploadedFiles.some((loadedFile) => loadedFile.name === file.name)
            ) {
              setUploadedFiles((prevUploadedFiles) => {
                const newUploadedFile = {
                  name: file.name,
                  content: reader.result as string,
                }
                return prevUploadedFiles !== null
                  ? [...prevUploadedFiles, newUploadedFile]
                  : [newUploadedFile]
              })
            } else {
              setErrorMessage('Duplicate file names are not allowed')
            }
          }
          reader.readAsText(file)
        } else if (file.name.endsWith('.zip')) {
          const zip = new JSZip()
          zip.loadAsync(file).then(async function (zippedFiles) {
            const unzippedFiles: UploadedFile[] = []
            for (const zippedFile of Object.keys(zippedFiles.files)) {
              if (
                !uploadedFiles ||
                !uploadedFiles.some(
                  (loadedFile) => loadedFile.name === zippedFile
                )
              ) {
                if (zippedFile.endsWith('.xes')) {
                  const fileData = await zippedFiles.files[zippedFile].async(
                    'string'
                  )
                  unzippedFiles.push({ name: zippedFile, content: fileData })
                } else {
                  setErrorMessage('Files must be either .xes or .zip files')
                  console.warn(zippedFile + ' was neither a .xes or .zip file')
                }
              } else {
                setErrorMessage('Duplicate file names are not allowed')
              }
            }
            setUploadedFiles((prevUploadedFiles) => {
              return prevUploadedFiles !== null
                ? [...prevUploadedFiles, ...unzippedFiles]
                : [...unzippedFiles]
            })
          })
        } else {
          setErrorMessage('Files must be either .xes or .zip files')
          console.warn(file.name + ' was neither a .xes or .zip file')
        }
      })
    },
    [uploadedFiles]
  )

  const reset = () => {
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
                      uploadedFiles === null || uploadedFiles.length === 0
                        ? ''
                        : 'Disabled while there is an uploaded file'
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
                      disabled={
                        !(uploadedFiles === null || uploadedFiles.length === 0)
                      }
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
                </Box>
              </Box>
              <Box textAlign='center' sx={{ marginTop: '1em' }}>
                {errorMessage != '' && (
                  <Typography variant='body1'>
                    <Box
                      sx={{
                        backgroundColor: 'red',
                        padding: '5px',
                        borderRadius: '10px',
                        marginBottom: '0.5em',
                      }}
                    >
                      {errorMessage}
                    </Box>
                  </Typography>
                )}
                <Button variant='contained' color='primary' onClick={reset}>
                  Reset
                </Button>
              </Box>
              {!(uploadedFiles === null || uploadedFiles.length === 0) && (
                <>
                  <Typography variant='h6'>Uploaded files:</Typography>
                  <Box sx={{ padding: '5px' }}>
                    {uploadedFiles.map((file, index) => (
                      <Button
                        key={file.name + index}
                        sx={{
                          marginTop: '8px',
                          padding: '8px',
                          alignItems: 'center',
                          borderRadius: '10px',
                        }}
                        variant='contained'
                        color='success'
                        fullWidth
                        onClick={() =>
                          setUploadedFiles(
                            uploadedFiles.filter(
                              (prevfile) => file.name !== prevfile.name
                            )
                          )
                        }
                      >
                        {file.name}
                      </Button>
                    ))}
                  </Box>
                </>
              )}
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
                  onClick={async () => {
                    if (uploadedFiles === null || uploadedFiles.length === 0) {
                      exportStringAsFile(
                        postProcessXESFile(traceText, postprocessing),
                        'postProcessedEventLog.xes'
                      )
                    } else if (uploadedFiles.length === 1) {
                      const newFileName =
                        uploadedFiles[0].name.slice(0, -4) +
                        '_PostProcessed.xes'
                      exportStringAsFile(
                        postProcessXESFile(
                          uploadedFiles[0].content,
                          postprocessing
                        ),
                        newFileName
                      )
                    } else {
                      const zip = new JSZip()
                      uploadedFiles.forEach((file) => {
                        const updatedContent = postProcessXESFile(
                          file.content,
                          postprocessing
                        )
                        const newFileName =
                          file.name.slice(0, -4) + '_PostProcessed.xes'
                        zip.file(newFileName, updatedContent, {
                          binary: false,
                        })
                      })
                      await zip.generateAsync({ type: 'blob' }).then((blob) => {
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.download = `Post-Processed-${new Date()
                          .toDateString()
                          .replace(/ /g, '_')}.zip`
                        a.href = url
                        a.click()
                        URL.revokeObjectURL(url)
                      })
                    }
                  }}
                  disabled={
                    traceText === '' &&
                    (uploadedFiles === null || uploadedFiles.length === 0)
                  }
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
