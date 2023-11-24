import { useCallback, useState } from 'react'

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
import { PreventExitModel } from './editor/PreventExitModel'
import { useEditorStore } from './editor/editorStore/flowStore'

const RECENT_PROJECTS_LIMIT = 5 // number of projects to show in the recent projects list

export const CustomAppBar: React.FC = () => {
  const [isNewProjectModalOpen, setNewProjectModalOpen] = useState(false)

  const [
    isPreventCollaborationExitModelOpen,
    setPreventCollaborationExitModelOpen,
  ] = useState(false)

  const projects = usePersistentStore((state) => state.projects)

  const sessionStart = useEditorStore((state) => state.sessionStart)

  const setRoomTextfieldState = useEditorStore(
    (state) => state.setRoomTextfieldState
  )

  const isCollaborating = useEditorStore(
    (state) => state.yWebRTCProvider !== null
  )

  const preventExit = useCallback(
    (
      e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>
    ) => {
      if (isCollaborating) {
        e.preventDefault()
        setPreventCollaborationExitModelOpen(true)
      } else {
        setRoomTextfieldState('', false)
      }
    },
    [isCollaborating]
  )

  const pages = [
    {
      name: 'Home',
      href: '/',
    },
    {
      name: 'Batch',
      href: '/batch',
    },
    {
      name: 'Post Processing',
      href: '/postprocessing',
    },
    {
      name: 'Collaborate',
      href: '/collaborate',
    },
  ]

  // These pages will not be shown in the final product but are useful during development
  // const debugPages = [
  //   {
  //     name: 'Post Processing (Debug)',
  //     href: '/debug_postprocessing',
  //   },
  //   {
  //     name: 'Debug',
  //     href: '/debug',
  //   },
  // ]

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
            onClick={preventExit}
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
                onClick={preventExit}
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
                onClick={preventExit}
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
            onClick={(e) => {
              preventExit(e)
              // TODO: Check manually if this should be prevented
              if (isCollaborating) return
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
          {/* {debugPages.length > 0 && (
            <Divider
              orientation='vertical'
              flexItem
              variant='middle'
              style={{
                marginRight: '1rem',
                marginLeft: '1rem',
              }}
            />
          )}
          {debugPages.map((page) => (
            <Button
              key={page.name}
              sx={{
                my: 2,
                alignSelf: 'right',
                alignItems: 'right',
                color: 'white',
                display: 'block',
              }}
              onClick={preventExit}
              to={page.href}
              component={Link}
            >
              {page.name}
            </Button>
          ))} */}
        </Toolbar>
      </Container>
      <NewProjectModal
        open={isNewProjectModalOpen}
        onClose={() => {
          setNewProjectModalOpen(false)
        }}
        redirect
      />
      <PreventExitModel
        open={isPreventCollaborationExitModelOpen}
        onClose={() => {
          setPreventCollaborationExitModelOpen(false)
        }}
      />
    </AppBar>
  )
}
