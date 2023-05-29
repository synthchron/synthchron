import React from 'react'

import AddIcon from '@mui/icons-material/Add'
import { Box, Grid, IconButton, Paper, Tooltip } from '@mui/material'

import { BottomAppBar } from '../components/BottomAppBar'
import { CustomAppBar } from '../components/CustomAppBar'
import NewProjectModal from '../components/NewProjectModal'
import { ProjectCard } from '../components/ProjectCard'
import { usePersistentStore } from '../components/common/persistentStore'

export const MainMenuPage = () => {
  const projects = usePersistentStore((state) => state.projects)
  const [isNewProjectModalOpen, setNewProjectModalOpen] = React.useState(false)

  return (
    <div
      style={{
        minHeight: '100vh',
      }}
    >
      <CustomAppBar />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 'calc(100vh - 72px)',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: ['90%', '90%', '90%', '1200px'],
            margin: '2em auto',
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6} md={4} lg={3}>
              <Tooltip title='Create new project' arrow placement='left'>
                <Paper
                  style={{
                    minHeight: 250,
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f5f5f5',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setNewProjectModalOpen(true)
                  }}
                >
                  <IconButton>
                    <AddIcon fontSize='large' />
                  </IconButton>
                </Paper>
              </Tooltip>
            </Grid>
            {Object.entries(projects)
              .sort(([, p1], [, p2]) => {
                return Date.parse(p1.lastEdited) - Date.parse(p2.lastEdited)
              })
              .reverse()
              .map(([k, v]) => (
                <Grid key={k} item xs={6} md={4} lg={3}>
                  <ProjectCard projectId={k} project={v} />
                </Grid>
              ))}
          </Grid>
        </Box>
        <NewProjectModal
          open={isNewProjectModalOpen}
          onClose={() => {
            setNewProjectModalOpen(false)
          }}
        />
        <div
          style={{
            justifySelf: 'flex-end',
            backgroundColor: 'red',
          }}
        >
          <BottomAppBar />
        </div>
      </div>
    </div>
  )
}
