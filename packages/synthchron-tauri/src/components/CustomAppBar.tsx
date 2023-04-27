import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded'
import { Container, Divider, IconButton } from '@mui/material'
import { usePersistentStore } from './common/persistentStore'
import NewProjectModal from './NewProjectModal'
import { useState } from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { Link } from 'react-router-dom'

const RECENT_PROJECTS_LIMIT = 5 // number of projects to show in the recent projects list
const RECENT_PROJECTS_TIMEOUT = 60 * 60 * 1000 // time in milliseconds that projects are still considered recent

export const CustomAppBar: React.FC = () => {
  const [isNewProjectModalOpen, setNewProjectModalOpen] = useState(false)

  const projects = usePersistentStore((state) => state.projects)

  const pages = [
    {
      name: 'Home',
      href: '/',
    },
    {
      name: 'Debug',
      href: '/debug',
    },
  ]

  const projectButtons = Object.entries(projects)
    .sort(
      ([_key1, x], [_key2, y]) =>
        -(Date.parse(x.lastEdited) - Date.parse(y.lastEdited))
    )
    .filter(
      ([, y]) => Date.now() - Date.parse(y.lastEdited) < RECENT_PROJECTS_TIMEOUT
    )
    .slice(0, RECENT_PROJECTS_LIMIT)
    .map(([x, y]) => ({
      name: y.projectName.slice(0, 25),
      href: `/editor/${x}`,
    }))

  return (
    <AppBar
      position='static'
      sx={{
        zIndex: 1, // Make sure the topbar is on top of the sidebars
      }}
    >
      <Container maxWidth='xl'>
        <Toolbar variant='dense' disableGutters>
          <AccountTreeRoundedIcon sx={{ mr: 1 }} />
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <Typography
            variant='h6'
            noWrap
            to='/'
            component={Link}
            sx={{
              mr: 2,
              display: 'flex',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SYN
          </Typography>

          <Box sx={{ display: 'flex' }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => {
                  // Do nothing
                }}
                sx={{
                  my: 2,
                  alignSelf: 'right',
                  alignItems: 'right',
                  color: 'white',
                  display: 'block',
                }}
                to={page.href}
                component={Link}
              >
                {page.name}
              </Button>
            ))}
          </Box>
          <Divider
            orientation='vertical'
            flexItem
            variant='middle'
            style={{
              marginRight: '1rem',
              marginLeft: '1rem',
            }}
          />
          <Box sx={{ display: 'flex' }}>
            {projectButtons.map((page) => (
              <Button
                key={page.name}
                disabled={page.href === window.location.pathname}
                sx={{
                  my: 2,
                  alignSelf: 'right',
                  alignItems: 'right',
                  color: 'white',
                  display: 'block',
                }}
                to={page.href}
                component={Link}
              >
                {page.name}
              </Button>
            ))}
          </Box>
          <IconButton
            sx={{
              color: 'white',
            }}
            aria-label='create a new project'
            onClick={() => {
              setNewProjectModalOpen(true)
            }}
          >
            <AddCircleIcon />
          </IconButton>
          <Box
            style={{
              flexGrow: 1,
            }}
          />
          <Button
            sx={{
              my: 2,
              alignSelf: 'right',
              alignItems: 'right',
              color: 'white',
              display: 'block',
            }}
            to={'/collaborate'}
            component={Link}
          >
            Collaborate
          </Button>
        </Toolbar>
      </Container>
      <NewProjectModal
        open={isNewProjectModalOpen}
        onClose={() => {
          setNewProjectModalOpen(false)
        }}
        redirect
      />
    </AppBar>
  )
}
