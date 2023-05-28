import { Paper, Slider, Typography } from '@mui/material'

interface PercentSliderProps {
  title: string
  value: number
  setValue: (value: number) => void
}

export const PercentSlider: React.FC<PercentSliderProps> = ({
  title,
  value,
  setValue,
}) => (
  <Paper
    sx={{
      padding: '16px',
    }}
  >
    <Typography gutterBottom>{title}</Typography>
    <Slider
      getAriaLabel={() => 'Event range'}
      value={value}
      onChange={(_event, value, _activeThumb) => setValue(value as number)}
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
  </Paper>
)
