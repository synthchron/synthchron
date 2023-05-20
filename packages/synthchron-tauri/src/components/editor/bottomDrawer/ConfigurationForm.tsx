import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { Stack } from '@mui/material'

import { PostprocessingConfiguration } from '@synthchron/postprocessor'
import {
  StandardConfigurationTerminationType,
  TerminationType,
} from '@synthchron/simulator'
import { Configuration } from '@synthchron/simulator'

import { MinMaxSlider } from './configurationPanel/MinMaxSlider'
import { NameField } from './configurationPanel/NameField'
import { ObjectForm } from './configurationPanel/ObjectForm'
import { PercentSlider } from './configurationPanel/PercentSlider'
import PostprocessingPanel from './postprocessingPanel/PostprocessingPanel'

type ConfigurationFormProps = {
  config: Configuration
  setConfig: (config: Configuration) => void
}

//Default values of configuration for simulation.
const minMaxEvents = [1, 100]
const partialNotAutoConfiguration: Partial<Configuration> = {
  //These are values that should not be automatically generated
  endOnAcceptingStateProbability: 100,
  minEvents: minMaxEvents[0],
  maxEvents: minMaxEvents[1],
  postprocessing: {
    stepProbability: 0.1,
    postProcessingSteps: [],
  },
}
const partialAutoConfiguration: Partial<Configuration> = {
  //These are values that can be automatically generated
  randomSeed: '',
  //Add other configuration options here
  configurationName: 'Default',
  maximumTraces: 1,

  terminationType: {
    type: TerminationType.Standard,
  } as StandardConfigurationTerminationType,
}

export const defaultConfiguration: Configuration = {
  ...partialAutoConfiguration,
  ...partialNotAutoConfiguration,
} as Configuration // Needed, as we don't know whether the two partials are complete

export const ConfigurationForm: React.FC<ConfigurationFormProps> = ({
  config,
  setConfig,
}) => {
  const postprocessing = config.postprocessing
  const setPostprocessing = (
    f: (
      postprocessing: PostprocessingConfiguration
    ) => PostprocessingConfiguration
  ) => {
    setConfig({
      ...config,
      postprocessing: f(config.postprocessing),
    })
  }

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
          'postprocessing',
        ]}
      />

      <PostprocessingPanel
        postprocessing={postprocessing}
        setPostprocessing={setPostprocessing}
      />
    </Stack>
  )
}
