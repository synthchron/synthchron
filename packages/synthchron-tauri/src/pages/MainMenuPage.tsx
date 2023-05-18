import React from 'react'

import AddIcon from '@mui/icons-material/Add'
import { Grid, IconButton, Paper } from '@mui/material'

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
      <Grid
        sx={{ flexGrow: 1 }}
        container
        spacing={2}
        style={{
          marginBottom: '3em',
        }}
      >
        <Grid
          item
          sx={{
            xs: 12,
            height: 20,
          }}
        />
        <Grid item justifyContent={'center'} xs={12}>
          <Grid container justifyContent={'center'} spacing={2}>
            <Grid item xs={9}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
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
                    <Grid key={i} item xs={4}>
                      <ProjectCard projectId={k} project={v} />
                    </Grid>
                  ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
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
