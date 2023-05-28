import { Masonry } from '@mui/lab'
import { Stack } from '@mui/material'

import {
  Configuration,
  PostprocessingConfiguration,
  StandardConfigurationTerminationType,
  TerminationType,
} from '@synthchron/types'

import { MaxStepsField } from './configurationPanel/MaxStepsField'
import { MinMaxSlider } from './configurationPanel/MinMaxSlider'
import { NameField } from './configurationPanel/NameField'
import { ObjectForm } from './configurationPanel/ObjectForm'
import { PercentSlider } from './configurationPanel/PercentSlider'
import { RandomSeedSelector } from './configurationPanel/RandomSeedSelector'
import { UniqueTracesSlide } from './configurationPanel/UniqueTracesSlider'
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
  randomSeed: undefined,
  //Add other configuration options here
  configurationName: 'Default',
  maximumTraces: 1,
  uniqueTraces: false,

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
    <Masonry columns={2} spacing={2}>
      <NameField
        name={config.configurationName ?? 'Default'}
        setName={(value) => setConfig({ ...config, configurationName: value })}
      />

      <RandomSeedSelector
        value={config.randomSeed}
        setValue={(value) => setConfig({ ...config, randomSeed: value })}
      />

      <MaxStepsField
        value={config.maximumTraces}
        setValue={(value) => setConfig({ ...config, maximumTraces: value })}
      />

      <UniqueTracesSlide
        value={config.uniqueTraces}
        setValue={(value) => setConfig({ ...config, uniqueTraces: value })}
      />

      <PercentSlider
        value={config.endOnAcceptingStateProbability}
        setValue={(value) =>
          setConfig({ ...config, endOnAcceptingStateProbability: value })
        }
        title='Probability to terminate on accepting state'
      />

      <MinMaxSlider
        value={[config.minEvents ?? 0, config.maxEvents ?? 100]}
        setValue={(value) =>
          setConfig({ ...config, minEvents: value[0], maxEvents: value[1] })
        }
        title='Minimum and maximum number of events per trace'
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
          'randomSeed',
          'uniqueTraces',
          'maximumTraces',
        ]}
      />

      <PostprocessingPanel
        postprocessing={postprocessing}
        setPostprocessing={setPostprocessing}
      />
    </Masonry>
  )
}

/* <Stack spacing={3} sx={{ marginTop: '30px', marginBottom: '30px' }}>
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
    </Stack> */
