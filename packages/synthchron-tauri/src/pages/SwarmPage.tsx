import { useEffect, useRef, useState } from 'react'

import { Box, Button, LinearProgress, Stack, Typography } from '@mui/material'
import JSZip from 'jszip'

import { PostprocessSimulation } from '@synthchron/postprocessor/src/postprocess'
import {
  PetriNetProcessModel,
  petriNetEngine,
  simulateWithEngine,
} from '@synthchron/simulator'
import { Configuration } from '@synthchron/types'
import { serialize } from '@synthchron/xes'

import { BottomAppBar } from '../components/BottomAppBar'
import { CustomAppBar } from '../components/CustomAppBar'
import { usePersistentStore } from '../components/common/persistentStore'
import { TitledCheckedList } from '../components/swarm/TitledCheckedList'
import { transformSimulationLogToXESLog } from '../utils/simulatorToXESConverter'

export const SwarmPage = () => {
  const projects = usePersistentStore((state) => state.projects)
  const configurations = usePersistentStore((state) => state.configurations)

  const [checkedProjects, setCheckedProjects] = useState([0])
  const [checkedConfigs, setCheckedConfigs] = useState([0])

  const [progress, setProgress] = useState(0)
  const [modelProgress, setModelProgress] = useState(0)
  const [configProgress, setConfigProgress] = useState(0)
  const [currentModel, setCurrentModel] = useState<string | undefined>(
    undefined
  )
  const [currentConfig, setCurrentConfig] = useState<string | undefined>(
    undefined
  )
  const [inSimulation, setInSimulation] = useState(false)

  const abortSimulation = useRef(false)
  useEffect(() => {
    abortSimulation.current = false
    return () => {
      abortSimulation.current = true
    }
  }, [])

  const simulate = async () => {
    const resultFiles: [string, string, string][] = []
    for (const [projectIndexIndex, projectIndex] of checkedProjects.entries()) {
      setCurrentModel(Object.values(projects)[projectIndex].projectName)
      for (const [configIndexIndex, configIndex] of checkedConfigs.entries()) {
        setCurrentConfig(
          configurations[configIndex].configurationName ?? 'Default'
        )
        const config: Configuration = {
          ...configurations[configIndex],
          randomSeed:
            configurations[configIndex].randomSeed === undefined
              ? Math.floor(Math.random() * Math.pow(2, 31)).toString()
              : configurations[configIndex].randomSeed,
        }
        const simulator = simulateWithEngine(
          Object.values(projects)[projectIndex]
            .projectModel as PetriNetProcessModel,
          config,
          petriNetEngine
        )
        for await (const { progress, simulationLog } of simulator) {
          if (abortSimulation.current) {
            setCurrentModel(undefined)
            setCurrentConfig(undefined)
            setProgress(0)
            setModelProgress(0)
            setConfigProgress(0)
            setInSimulation(false)
            return []
          }
          setProgress(
            (100 *
              (projectIndexIndex +
                (configIndexIndex + progress / 100) / checkedConfigs.length)) /
              checkedProjects.length
          )
          setModelProgress(
            (100 * (configIndexIndex + progress / 100)) / checkedConfigs.length
          )
          setConfigProgress(progress)
          // DO not delete this line, it is needed to update the UI - Ali
          await new Promise((resolve) => setTimeout(resolve, 0))
          if (simulationLog == null) continue
          PostprocessSimulation(simulationLog, config)
          resultFiles.push([
            Object.values(projects)[projectIndex].projectName,
            configurations[configIndex].configurationName ?? '',
            serialize(transformSimulationLogToXESLog(simulationLog)),
          ])
        }
        //return result
      }
    }

    return resultFiles
  }

  return (
    <>
      <CustomAppBar />
      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '2em',
          marginBottom: '1em',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: '50vw',
          }}
        >
          <Typography
            sx={{
              alignSelf: 'center',
            }}
            variant='h4'
          >
            Swarm Simulation
          </Typography>
          <Typography
            sx={{
              alignSelf: 'center',
              textAlign: 'center',
            }}
          >
            Start a swarm simulation by choosing multiple projects and multiple
            configurations to run. <br /> Select at least one project and one
            configuration to start.
          </Typography>
        </Box>
        <Stack direction={'row'} spacing={2} width={'80vw'} margin={'1em'}>
          <TitledCheckedList
            title='Projects'
            checked={checkedProjects}
            setChecked={setCheckedProjects}
            items={Object.values(projects).map(
              (project) => project.projectName
            )}
          />

          <TitledCheckedList
            title='Configurations'
            checked={checkedConfigs}
            setChecked={setCheckedConfigs}
            items={Object.values(configurations)
              .filter(
                (configuration) => configuration.configurationName != undefined
              )
              .map(
                (configuration) => configuration.configurationName as string
              )}
          />
        </Stack>
        {inSimulation ? (
          <Box>
            <LinearProgress
              value={progress}
              variant='determinate'
              style={{
                marginBottom: '16px',
                width: '80vw',
              }}
            />
            <Typography
              variant='caption'
              sx={{
                alignSelf: 'center',
              }}
            >
              Simulating model {currentModel}
            </Typography>
            <LinearProgress
              value={modelProgress}
              variant='determinate'
              sx={{
                marginBottom: '16px',
                width: '80vw',
                '& .MuiLinearProgress-bar': {
                  // 10ms
                  transition: 'transform 100ms linear',
                },
              }}
            />
            <Typography
              variant='caption'
              sx={{
                alignSelf: 'center',
              }}
            >
              Simulating using config {currentConfig}
            </Typography>
            <LinearProgress
              value={configProgress}
              variant='determinate'
              sx={{
                marginBottom: '16px',
                width: '80vw',
                '& .MuiLinearProgress-bar': {
                  // 10ms
                  transition: 'transform 100ms linear',
                },
              }}
            />
            <Button
              variant='contained'
              fullWidth
              disabled={abortSimulation.current} // make it error color
              onClick={() => {
                abortSimulation.current = true
                setInSimulation(false)
              }}
              color='error'
            >
              {abortSimulation.current ? 'Aborting...' : 'Abort Simulation'}
            </Button>
          </Box>
        ) : (
          <Button
            sx={{
              alignSelf: 'center',
              maxWidth: '80vw',
            }}
            variant='contained'
            fullWidth
            disabled={
              checkedProjects.length === 0 || checkedConfigs.length === 0
            }
            onClick={() => {
              setInSimulation(true)
              setProgress(0)
              simulate().then(async (result: [string, string, string][]) => {
                if (abortSimulation.current || result.length === 0) {
                  setInSimulation(false)
                  abortSimulation.current = false
                  return
                }
                const zip = new JSZip()
                for (const [projectName, configurationName, xes] of result) {
                  zip.file(`${projectName} - ${configurationName}.xes`, xes, {
                    binary: false,
                  })
                }
                await zip.generateAsync({ type: 'blob' }).then((blob) => {
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.download = `swarm-${new Date()
                    .toDateString()
                    .replace(/ /g, '_')}.zip`
                  a.href = url
                  a.click()
                  URL.revokeObjectURL(url)
                })

                // await new Promise((resolve) => setTimeout(resolve, 2500))
                setInSimulation(false)
                //nextStep()
              })
            }}
          >
            Start {checkedProjects.length * checkedConfigs.length} simulations
          </Button>
        )}
      </Stack>
      <BottomAppBar />
    </>
  )
}
