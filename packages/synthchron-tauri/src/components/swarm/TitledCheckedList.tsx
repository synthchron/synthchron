import { Divider, Paper, Typography } from '@mui/material'

import { CheckedList } from './CheckedList'

interface TitledCheckedListProps {
  checked: number[]
  setChecked: (checked: number[]) => void
  items: string[]
  title: string
}

export const TitledCheckedList: React.FC<TitledCheckedListProps> = ({
  checked,
  setChecked,
  items,
  title,
}) => (
  <Paper
    sx={{
      width: '100%',
    }}
  >
    <Typography
      sx={{
        padding: '1rem',
      }}
      variant='h6'
    >
      {title}
    </Typography>
    <Divider />
    <CheckedList checked={checked} setChecked={setChecked} items={items} />
  </Paper>
)
