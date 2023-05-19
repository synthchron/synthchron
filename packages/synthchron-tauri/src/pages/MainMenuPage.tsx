import React from 'react'

import AddIcon from '@mui/icons-material/Add'
import { Box, Grid, IconButton, Paper } from '@mui/material'

import { BottomAppBar } from '../components/BottomAppBar'
import { CustomAppBar } from '../components/CustomAppBar'
import NewProjectModal from '../components/NewProjectModal'
import { ProjectCard } from '../components/ProjectCard'
import { usePersistentStore } from '../components/common/persistentStore'

export const MainMenuPage = () => {
  const projects = usePersistentStore((state) => state.projects)
  const [isNewProjectModalOpen, setNewProjectModalOpen] = React.useState(false)

  return (
    <>
      <CustomAppBar />
      <Box
        sx={{
          maxWidth: ['90%', '90%', '90%', '1200px'],
          margin: '2em auto',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6} md={4} lg={3}>
            <Paper
              style={{
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
          </Grid>
          {Object.entries(projects)
            .sort(([, p1], [, p2]) => {
              return Date.parse(p1.lastEdited) - Date.parse(p2.lastEdited)
            })
            .reverse()
            .map(([k, v], i) => (
              <Grid key={i} item xs={6} md={4} lg={3}>
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
      <BottomAppBar />
    </>
  )
}
