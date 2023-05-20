import { useCallback, useEffect } from 'react'

import {
  Checkbox,
  FormControlLabel,
  Grid,
  Input,
  Slider,
  Stack,
  Typography,
} from '@mui/material'
import { shallow } from 'zustand/shallow'

import {
  Configuration,
  StandardConfigurationTerminationType,
  TerminationType,
} from '@synthchron/types'

import { EditorState, useEditorStore } from '../editorStore/flowStore'

enum rangeSliderElement {
  Min,
  Max,
  Both,
}

type SimulationConfigurationProperty = {
  onUpdate: (config: Configuration) => void
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

export const SimulationConfiguration: React.FC<
  SimulationConfigurationProperty
> = ({ onUpdate }) => {
  const selector = useCallback(
    (state: EditorState) => ({
      config: state.config,
      setConfig: state.setConfig,
    }),
    []
  )
  const { config, setConfig } = useEditorStore(selector, shallow)

  //const [config, setConfig] = useState<Configuration>(defaultConfiguration)

  function UpdateConfig(): void {
    const configuration: Configuration = {
      ...config,
      endOnAcceptingStateProbability:
        config.endOnAcceptingStateProbability / 100,
    }
    onUpdate(configuration)
  }

  useEffect(() => {
    // When config is changed in this file, push the changes to the simulation tab
    UpdateConfig()
  }, [config])

  //Handle changes to range slider
  const handleChangeToDoubleSlider = (
    newValue: number | number[],
    sliderElem: rangeSliderElement,
    configKeys: (keyof Configuration)[]
  ) => {
    switch (sliderElem) {
      case rangeSliderElement.Min:
        setConfig({ ...config, [configKeys[0]]: newValue as number })
        break
      case rangeSliderElement.Max:
        setConfig({ ...config, [configKeys[1]]: newValue as number })
        break
      case rangeSliderElement.Both:
        Array.isArray(newValue)
          ? setConfig({
              ...config,
              [configKeys[0]]: newValue[0],
              [configKeys[1]]: newValue[1],
            })
          : undefined
        break
    }
  }

  const camelCaseToString = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
  }

  //Const for making sliders with a min and max. The Range of this is hard coded for now.
  const createMinMaxSlider = (
    configKeys: (keyof Configuration)[],
    stateValue: number[],
    title: string
  ) => {
    return (
      <div>
        <Typography gutterBottom>{title}</Typography>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={3}>
            <Input
              value={(stateValue[0] * 1).toString()}
              size='small'
              onChange={(event) =>
                handleChangeToDoubleSlider(
                  Number(event.target.value),
                  rangeSliderElement.Min,
                  configKeys
                )
              }
              inputProps={{
                step: 1,
                min: 0,
                type: 'number',
              }}
            />
          </Grid>
          <Grid item xs>
            <Slider
              getAriaLabel={() => 'Event range'}
              value={stateValue}
              onChange={(_event, value, _activeThumb) =>
                handleChangeToDoubleSlider(
                  value,
                  rangeSliderElement.Both,
                  configKeys
                )
              }
              valueLabelDisplay='auto'
              min={0}
              max={1000}
            />
          </Grid>
          <Grid item xs={3}>
            <Input
              value={(stateValue[1] * 1).toString()}
              size='small'
              onChange={(event) =>
                handleChangeToDoubleSlider(
                  Number(event.target.value),
                  rangeSliderElement.Max,
                  configKeys
                )
              }
              inputProps={{
                step: 1,
                min: 0,
                type: 'number',
              }}
            />
          </Grid>
        </Grid>
      </div>
    )
  }

  const percentSlider = (
    configKey: keyof Configuration,
    stateValue: number,
    title: string
  ) => {
    return (
      <div>
        <Typography gutterBottom>{title}</Typography>
        <Slider
          getAriaLabel={() => 'Event range'}
          value={stateValue}
          onChange={(_event, value, _activeThumb) =>
            setConfig({ ...config, [configKey]: Number(value) })
          }
          valueLabelDisplay='auto'
          min={0}
          max={100}
          marks={[
            { value: 0, label: '0%' },
            { value: 25, label: '25%' },
            { value: 50, label: '50%' },
            { value: 75, label: '75%' },
            { value: 100, label: '100%' },
          ]}
        />
      </div>
    )
  }

  return (
    <Stack spacing={6} sx={{ marginTop: '30px', marginBottom: '30px' }}>
      {percentSlider(
        'endOnAcceptingStateProbability',
        config.endOnAcceptingStateProbability,
        'Chance To End On Accepting State:'
      )}
      {Object.entries(config).map(([key, value]) => {
        if (!(key in partialNotAutoConfiguration)) {
          return (
            <div key={key}>
              <Typography gutterBottom>
                {camelCaseToString(key) + ':'}
              </Typography>
              {(() => {
                switch (typeof value) {
                  case 'string':
                    return (
                      <Input
                        fullWidth
                        value={value}
                        onChange={(event) =>
                          setConfig({ ...config, [key]: event.target.value })
                        }
                      />
                    )
                  case 'number':
                    return (
                      <Input
                        fullWidth
                        value={(value * 1).toString()}
                        onChange={(newValue) =>
                          setConfig({
                            ...config,
                            [key]: Number(newValue.target.value),
                          })
                        }
                        inputProps={{
                          step: 1,
                          min: 0,
                          type: 'number',
                        }}
                      />
                    )
                  case 'boolean':
                    return (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={value}
                            onChange={(newValue) =>
                              setConfig({
                                ...config,
                                [key]: newValue.target.checked,
                              })
                            }
                          />
                        }
                        label={key}
                      />
                    )
                  default:
                    return <p>NOT IMPLEMENTED TYPE FOR {key}</p>
                }
              })()}
            </div>
          )
        }
      })}
      {createMinMaxSlider(
        ['minEvents', 'maxEvents'],
        [config.minEvents ?? 0, config.maxEvents ?? 100], // using '??' to provide a default value if they are undefined
        'Minimum and Maximum Events:'
      )}
    </Stack>
  )
}
