import { faker } from '@faker-js/faker'
import { Button } from '@mui/material'
import { Offline, Online } from 'react-detect-offline'

import {
  PostProcessingConfiguration,
  PostProcessingStepType,
  postprocess,
} from '@synthchron/postprocessor'
import {
  Configuration,
  StandardConfigurationTerminationType,
  TerminationType,
  Trace,
} from '@synthchron/simulator'

import { CustomAppBar } from './CustomAppBar'
import { usePersistentStore } from './common/persistentStore'

export const Debug = () => {
  const projects = usePersistentStore((state) => state.projects)
  const removeProject = usePersistentStore((state) => state.removeProject)

  const test = () => {
    const traces: Trace[] = [
      {
        events: [
          { name: 'a', meta: {} },
          { name: 'b', meta: {} },
          { name: 'c', meta: {} },
          { name: 'd', meta: {} },
          { name: 'e', meta: {} },
          { name: 'f', meta: {} },
        ],
      },
    ]

    const steps: PostProcessingConfiguration = {
      stepProbability: 0.5,
      postProcessingSteps: [
        { type: PostProcessingStepType.DeletionStep, weight: 1 },
      ],
    }

    const config: Configuration = {
      endOnAcceptingStateProbability: 1,
      randomSeed: 'abc',
      terminationType: {
        type: TerminationType.Standard,
      } as StandardConfigurationTerminationType,
    }

    const answer = postprocess(traces, steps, config)

    console.log('Answer: ', answer)
  }

  return (
    <>
      <CustomAppBar />
      Hello World! You are{' '}
      <i>
        <Online>online</Online>
        <Offline>offline</Offline>
      </i>
      <Button
        onClick={() => {
          // Remove all projects
          Object.keys(projects).forEach((k) => removeProject(k))
        }}
      >
        Remove all projects
      </Button>
      <Button onClick={test}>Test</Button>
    </>
  )
}
