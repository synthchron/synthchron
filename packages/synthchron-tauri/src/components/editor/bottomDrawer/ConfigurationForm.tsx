import { useEffect, useState } from 'react'

import { Stack } from '@mui/material'

import {
  StandardConfigurationTerminationType,
  TerminationType,
} from '@synthchron/simulator'
import { Configuration } from '@synthchron/simulator'

import { MinMaxSlider } from './configurationPanel/MinMaxSlider'
import { NameField } from './configurationPanel/NameField'
import { ObjectForm } from './configurationPanel/ObjectForm'
import { PercentSlider } from './configurationPanel/PercentSlider'
import PostprocessingPanel, {
  PostProcessingConfiguration,
  PostProcessingStepType,
} from './postprocessingPanel/PostprocessingPanel'

type ConfigurationFormProps = {
  config: Configuration
  setConfig: (config: Configuration) => void
}

//Default values of configuration for simulation.
const minMaxEvents = [0, 500]
const partialNotAutoConfiguration = {
  //These are values that should not be automatically generated
  endOnAcceptingStateProbability: 100,
  minEvents: minMaxEvents[0],
  maxEvents: minMaxEvents[1],
}
const partialAutoConfiguration = {
  //These are values that can be automatically generated
  randomSeed: '',
  //Add other configuration options here
  configurationName: 'Default',
  maximumTraces: 1,

  terminationType: {
    type: TerminationType.Standard,
  } as StandardConfigurationTerminationType,
}
export const defaultConfiguration = {
  ...partialAutoConfiguration,
  ...partialNotAutoConfiguration,
}

export const ConfigurationForm: React.FC<ConfigurationFormProps> = ({
  config,
  setConfig,
}) => {
  const [postprocessing, setPostprocessing] =
    useState<PostProcessingConfiguration>({
      postProcessingSteps: [],
      stepProbability: 0,
    })

  useEffect(() => {
    setPostprocessing(
      config.configurationName == 'Second'
        ? {
            postProcessingSteps: [
              {
                type: PostProcessingStepType.InsertionStep,
                weight: 1,
              },
              {
                type: PostProcessingStepType.DeletionStep,
                weight: 1,
              },
              {
                type: PostProcessingStepType.SwapStep,
                weight: 1,
              },
            ],
            stepProbability: 0.5,
          }
        : {
            postProcessingSteps: [],
            stepProbability: 0,
          }
    )
  }, [config.configurationName])

  return (
    <Stack spacing={3} sx={{ marginTop: '30px', marginBottom: '30px' }}>
      <NameField
        name={config.configurationName ?? 'Default'}
        setName={(value) => setConfig({ ...config, configurationName: value })}
      />

      <PercentSlider
        value={config.endOnAcceptingStateProbability}
        setValue={(value) =>
          setConfig({ ...config, endOnAcceptingStateProbability: value })
        }
        title='Chance to terminate on accepting state'
      />

      <MinMaxSlider
        value={[config.minEvents ?? 0, config.maxEvents ?? 100]}
        setValue={(value) =>
          setConfig({ ...config, minEvents: value[0], maxEvents: value[1] })
        }
        title='Minimum and maximum Events:'
      />

      <ObjectForm
        object={config}
        set={(key, value) => setConfig({ ...config, [key]: value })}
        ignoreKeys={[
          'endOnAcceptingStateProbability',
          'minEvents',
          'maxEvents',
          'configurationName',
        ]}
      />

      <PostprocessingPanel
        postprocessing={postprocessing}
        setPostprocessing={setPostprocessing}
      />
    </Stack>
  )
}
