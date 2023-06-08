import { Slider, Stack, Typography } from '@mui/material'

interface PostprocessingCheckboxLineProps {
  label: string
  value: number
  setValue: (value: number) => void
}

export const PostprocessingCheckboxLine: React.FC<
  PostprocessingCheckboxLineProps
> = ({ label, value, setValue }) => {
  return (
    <Stack direction='row' alignItems='center' spacing={2}>
      {/* Name */}
      <Typography
        sx={{
          flexGrow: 1,
        }}
        align='right'
        variant='overline'
      >
        {label}
      </Typography>
      {/* Slider */}
      <Slider
        sx={{
          width: '80%',
        }}
        value={value}
        onChange={(_, value) => setValue(value as number)}
        min={0}
        max={1}
        step={0.01}
        valueLabelDisplay='auto'
      />
    </Stack>
  )
}
