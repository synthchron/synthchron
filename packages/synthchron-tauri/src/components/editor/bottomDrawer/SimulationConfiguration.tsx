import {
  Grid,
  Input,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'

import {
  StandardConfigurationTerminationType,
  TerminationType,
  TerminationTypeUnion,
} from '@synthchron/simulator'
import { Configuration } from '@synthchron/simulator'

enum rangeSliderElement {
  Min,
  Max,
  Both,
}

type SimulationConfigurationProps = {
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

export const SimulationConfiguration: React.FC<
  SimulationConfigurationProps
> = ({ config, setConfig }) => {
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
          style={{ width: '98%' }}
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

  const terminationTypeDefaults: {
    [key in TerminationType]: Omit<TerminationTypeUnion, 'type'>
  } = {
    [TerminationType.Standard]: {},
    [TerminationType.Coverage]: {
      coverage: 100,
    },
    [TerminationType.SpecifiedAmountOfTraces]: {
      amountOfTraces: 1,
    },
  }

  const customObjectToFormComponents = {
    terminationType: (
      obj: TerminationTypeUnion,
      set: (key: string, value: unknown) => void
    ) => (
      <>
        <Typography variant='h6' gutterBottom style={{ marginBottom: -10 }}>
          Termination Type
        </Typography>
        <Select
          labelId='termination-type-select-label'
          id='termination-type-select'
          value={obj.type}
          onChange={(event) => {
            const newType = event.target.value as TerminationType
            set('terminationType', {
              type: newType,
              ...terminationTypeDefaults[newType],
            })
          }}
        >
          {Object.entries(TerminationType).map(([key, value]) => (
            <MenuItem key={key} value={value}>
              {camelCaseToString(key)}
            </MenuItem>
          ))}
        </Select>
        {(() => {
          switch (obj.type) {
            case TerminationType.Standard:
              return <></>
            case TerminationType.Coverage:
              return (
                <TextField
                  label='Coverage'
                  fullWidth
                  value={obj.coverage}
                  onChange={(event) => {
                    const newCoverage = Number(event.target.value)
                    set('terminationType', {
                      type: TerminationType.Coverage,
                      coverage: newCoverage,
                    } as TerminationTypeUnion)
                  }}
                />
              )
            case TerminationType.SpecifiedAmountOfTraces:
              return (
                <TextField
                  label='Amount of traces'
                  fullWidth
                  value={obj.amountOfTraces}
                  onChange={(event) =>
                    set('terminationType', {
                      type: TerminationType.SpecifiedAmountOfTraces,
                      amountOfTraces: Number(event.target.value),
                    } as TerminationTypeUnion)
                  }
                />
              )
          }
        })()}
      </>
    ),
  }

  const objectToFormComponents = (
    obj: object,
    set: (key: string, value: unknown) => void,
    ignoreKeys: string[] = []
  ) =>
    obj == null ? (
      <></>
    ) : (
      Object.entries(obj)
        .filter(([key, _value]) => !ignoreKeys.includes(key))
        .map(([key, value]) => (
          <div key={key}>
            {(() => {
              switch (typeof value) {
                case 'string':
                  return (
                    <TextField
                      label={camelCaseToString(key)}
                      fullWidth
                      value={value}
                      onChange={(event) => set(key, event.target.value)}
                    />
                  )
                case 'number':
                  return (
                    <TextField
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                      label={camelCaseToString(key)}
                      fullWidth
                      value={(value * 1).toString()}
                      onChange={(event) => set(key, Number(event.target.value))}
                    />
                  )
                case 'boolean':
                  return (
                    <Switch
                      checked={value}
                      onChange={(event) => set(key, event.target.checked)}
                    />
                  )

                case 'object':
                  if (value == null) return <></>

                  if (key in customObjectToFormComponents)
                    return (
                      <Paper style={{ padding: '16px' }}>
                        <Stack spacing={3}>
                          {customObjectToFormComponents[
                            key as keyof typeof customObjectToFormComponents
                          ](value, set)}
                        </Stack>
                      </Paper>
                    )
                  return (
                    <Stack spacing={3}>
                      <Typography>{camelCaseToString(key)}</Typography>
                      {objectToFormComponents(value, (subKey, subValue) =>
                        set(key, { ...value, [subKey]: subValue })
                      )}
                    </Stack>
                  )

                default:
                  return (
                    <Typography>{`Unsupported type: ${typeof value}`}</Typography>
                  )
              }
            })()}
          </div>
        ))
    )

  return (
    <Stack spacing={3} sx={{ marginTop: '30px', marginBottom: '30px' }}>
      {/* {objectToFormComponents(config, (key, value) =>
        setConfig({ ...config, [key]: value })
      )} */}
      {percentSlider(
        'endOnAcceptingStateProbability',
        config.endOnAcceptingStateProbability,
        'Chance to terminate on accepting state'
      )}

      {createMinMaxSlider(
        ['minEvents', 'maxEvents'],
        [config.minEvents ?? 0, config.maxEvents ?? 100], // using '??' to provide a default value if they are undefined
        'Minimum and maximum Events:'
      )}

      {objectToFormComponents(
        config,
        (key, value) => setConfig({ ...config, [key]: value }),
        ['endOnAcceptingStateProbability', 'minEvents', 'maxEvents']
      )}
    </Stack>
  )
}
