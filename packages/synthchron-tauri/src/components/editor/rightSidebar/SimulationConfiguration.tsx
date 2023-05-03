import { useState } from 'react'

import { Grid, Input, Slider, Typography } from '@mui/material'

import { Configuration } from '@synthchron/simulator'

enum rangeSliderElement {
  Min,
  Max,
  Both,
}

type SimulationConfigurationProperty = {
  onUpdate: (config: Configuration) => void
}

export const SimulationConfiguration: React.FC<
  SimulationConfigurationProperty
> = ({ onUpdate }) => {
  const [eventAmount, setEventAmout] = useState<number[]>([1, 100])
  const [config, setConfig] = useState<Partial<Configuration>>({
    endOnAcceptingState: true,
    //Min and max events are handled sepperately
    randomSeed: '',
  })

  function UpdateConfig(): void {
    console.log(eventAmount)
    const configuration: Configuration = {
      endOnAcceptingState: true,
      randomSeed: '',
      minEvents: eventAmount[0],
      maxEvents: eventAmount[1],
    }
    onUpdate(configuration)
  }

  const handleChange = (
    newValue: number | number[],
    sliderElem: rangeSliderElement
  ) => {
    switch (sliderElem) {
      case rangeSliderElement.Min:
        setEventAmout((prevValue) => [newValue as number, prevValue[1]])
        break
      case rangeSliderElement.Max:
        setEventAmout((prevValue) => [prevValue[0], newValue as number])
        break
      case rangeSliderElement.Both:
        setEventAmout(newValue as number[])
        break
    }
    console.log('cur min = ' + newValue)
    UpdateConfig()
  }

  return (
    <>
      <Typography gutterBottom>Min and max events:</Typography>
      <Grid container spacing={2} alignItems='center'>
        <Grid item xs={3}>
          <Input
            value={eventAmount[0]}
            size='small'
            onChange={(event) =>
              handleChange(Number(event.target.value), rangeSliderElement.Min)
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
            value={eventAmount}
            onChange={(_event, value, _activeThumb) =>
              handleChange(value, rangeSliderElement.Both)
            }
            valueLabelDisplay='auto'
            min={0}
            max={1000}
          />
        </Grid>
        <Grid item xs={3}>
          <Input
            value={eventAmount[1]}
            size='small'
            onChange={(event) =>
              handleChange(Number(event.target.value), rangeSliderElement.Max)
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
