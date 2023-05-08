import { Fragment, useEffect, useState } from 'react'

import {
  Checkbox,
  FormControlLabel,
  Grid,
  Input,
  Slider,
  Typography,
} from '@mui/material'

import { Configuration } from '@synthchron/simulator'

enum rangeSliderElement {
  Min,
  Max,
  Both,
}

type SimulationConfigurationProperty = {
  onUpdate: (config: Configuration) => void
}

const minMaxEvents = [1, 100]
export const defaultConfiguration = {
  endOnAcceptingState: true,
  //Min and max events are handled sepperately
  randomSeed: '',
  minEvents: minMaxEvents[0],
  maxEvents: minMaxEvents[1],
}

export const SimulationConfiguration: React.FC<
  SimulationConfigurationProperty
> = ({ onUpdate }) => {
  //When changing these values, also change configuration state in 'SimulationTab.tsx'
  const [eventAmount, setEventAmout] = useState<number[]>(minMaxEvents)
  const [config, setConfig] = useState<Partial<Configuration>>({
    endOnAcceptingState: true,
    //Min and max events are handled sepperately
    randomSeed: '',
  })

  function UpdateConfig(): void {
    const configuration: Configuration = {
      ...config,
      minEvents: eventAmount[0],
      maxEvents: eventAmount[1],
      randomSeed: config.randomSeed
        ? config.randomSeed
        : Math.floor(Math.random() * 100).toString(),
    }
    onUpdate(configuration)
  }

  useEffect(() => {
    // When event amount changes, also change simulation configuration
    UpdateConfig()
  }, [eventAmount, config])

  //Handle changes to range slider
  const handleChange = (
    newValue: number | number[],
    sliderElem: rangeSliderElement,
    setFunction: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    switch (sliderElem) {
      case rangeSliderElement.Min:
        setFunction((prevValue) => [newValue as number, prevValue[1]])
        break
      case rangeSliderElement.Max:
        setFunction((prevValue) => [prevValue[0], newValue as number])
        break
      case rangeSliderElement.Both:
        setEventAmout(newValue as number[])
        break
    }
  }

  //Const for making sliders with a min and max. The Range of this is hard coded for now.
  const CreateMinMaxSlider = (
    setFunction: React.Dispatch<React.SetStateAction<number[]>>,
    stateValue: number[],
    title: string
  ) => {
    return (
      <>
        <Typography gutterBottom>{title}</Typography>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={3}>
            <Input
              value={stateValue[0]}
              size='small'
              onChange={(event) =>
                handleChange(
                  Number(event.target.value),
                  rangeSliderElement.Min,
                  setFunction
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
                handleChange(value, rangeSliderElement.Both, setFunction)
              }
              valueLabelDisplay='auto'
              min={0}
              max={1000}
            />
          </Grid>
          <Grid item xs={3}>
            <Input
              value={stateValue[1]}
              size='small'
              onChange={(event) =>
                handleChange(
                  Number(event.target.value),
                  rangeSliderElement.Max,
                  setFunction
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
      </>
    )
  }

  return (
    <>
      {Object.entries(config).map(([key, value]) => {
        return (
          <Fragment key={key}>
            <Typography gutterBottom>{key + ':'}</Typography>
            {(() => {
              switch (typeof value) {
                case 'string':
                  return (
                    <Input
                      size='small'
                      value={value}
                      onChange={(event) =>
                        setConfig({ ...config, [key]: event.target.value })
                      }
                    />
                  )
                case 'number':
                  return (
                    <Input
                      size='small'
                      value={value}
                      onChange={(newValue) =>
                        setConfig({ ...config, [key]: Number(newValue) })
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
          </Fragment>
        )
      })}
      {CreateMinMaxSlider(setEventAmout, eventAmount, 'Min and max events:')}
    </>
  )
}
