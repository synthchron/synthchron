import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'

interface CheckedListProps {
  checked: number[]
  setChecked: (checked: number[]) => void
  items: string[]
}

export const CheckedList: React.FC<CheckedListProps> = ({
  checked,
  setChecked,
  items,
}) => {
  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {items.map((value, index) => {
        const labelId = `checkbox-list-label-${index}`

        return (
          <ListItem key={index} disablePadding>
            <ListItemButton
              role={undefined}
              onClick={handleToggle(index)}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge='start'
                  checked={checked.indexOf(index) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value} />
            </ListItemButton>
          </ListItem>
        )
      })}
    </List>
  )
}
