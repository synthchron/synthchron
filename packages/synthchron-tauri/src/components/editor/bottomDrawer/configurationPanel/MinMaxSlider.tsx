import { Grid, Input, Slider, Typography } from '@mui/material'

interface MinMaxSliderProps {
  title: string
  value: [number, number]
  setValue: (value: [number, number]) => void
}

enum RangeSliderElement {
  Min,
  Max,
  Both,
}

const handleChangeToDoubleSlider = (
  value: [number, number],
  newValue: number | number[],
  sliderElem: RangeSliderElement,
  setValue: (value: [number, number]) => void
) => {
  switch (sliderElem) {
    case RangeSliderElement.Min:
      setValue([newValue as number, value[1]])
      break
    case RangeSliderElement.Max:
      setValue([value[0], newValue as number])
      break
    case RangeSliderElement.Both:
      Array.isArray(newValue) ? setValue([newValue[0], newValue[1]]) : undefined
      break
  }
}

export const MinMaxSlider: React.FC<MinMaxSliderProps> = ({
  title,
  value,
  setValue,
}) => (
  <div>
    <Typography gutterBottom>{title}</Typography>
    <Grid container spacing={2} alignItems='center'>
      <Grid item xs={3}>
        <Input
          value={(value[0] * 1).toString()}
          size='small'
          onChange={(event) =>
            handleChangeToDoubleSlider(
              value,
              Number(event.target.value),
              RangeSliderElement.Min,
              setValue
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
          value={value}
          onChange={(_event, newValue, _activeThumb) =>
            handleChangeToDoubleSlider(
              value,
              newValue,
              RangeSliderElement.Both,
              setValue
            )
          }
          valueLabelDisplay='auto'
          min={0}
          max={1000}
        />
      </Grid>
      <Grid item xs={3}>
        <Input
          value={(value[1] * 1).toString()}
          size='small'
          onChange={(event) =>
            handleChangeToDoubleSlider(
              value,
              Number(event.target.value),
              RangeSliderElement.Max,
              setValue
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
