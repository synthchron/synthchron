import GitHubIcon from '@mui/icons-material/GitHub'
import { BottomNavigation, BottomNavigationAction } from '@mui/material'

export const BottomAppBar: React.FC = () => {
  return (
    <BottomNavigation
      sx={{
        width: '100%',
        zIndex: 1,
      }}
    >
      <BottomNavigationAction
        label='GitHub'
        icon={<GitHubIcon />}
        href='https://github.com/synthchron/synthchron'
        target='_blank'
        rel='noopener noreferrer'
      />
    </BottomNavigation>
  )
}
