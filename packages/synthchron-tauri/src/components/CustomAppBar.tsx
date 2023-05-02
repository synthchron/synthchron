import { useState } from 'react'

import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'

import NewProjectModal from './NewProjectModal'
import { usePersistentStore } from './common/persistentStore'
import { useEditorStore } from './editor/editorStore/flowStore'

const RECENT_PROJECTS_LIMIT = 5 // number of projects to show in the recent projects list
//const RECENT_PROJECTS_TIMEOUT = 60 * 60 * 1000 // time in milliseconds that projects are still considered recent

export const CustomAppBar: React.FC = () => {
  const [isNewProjectModalOpen, setNewProjectModalOpen] = useState(false)

  const projects = usePersistentStore((state) => state.projects)

  const sessionStart = useEditorStore((state) => state.sessionStart)

  const pages = [
    {
      name: 'Home',
      href: '/',
    },
    {
      name: 'Collaborate',
      href: '/collaborate',
    },
  ]

  const projectButtons = Object.entries(projects)
    .sort(
      ([_key1, x], [_key2, y]) =>
        -(Date.parse(x.lastOpened) - Date.parse(y.lastOpened))
    )
    .filter(([, y]) => sessionStart < Date.parse(y.lastOpened))
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
            to={'/debug'}
            component={Link}
          >
            Debug
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
