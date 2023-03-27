import { Grid, IconButton } from '@mui/material'

import { usePersistentStore } from '../components/common/persistentStore'
import { CustomAppBar } from '../components/CustomAppBar'
import { ProjectCard } from '../components/ProjectCard'
import AddCircleIcon from '@mui/icons-material/AddCircle'

import React from 'react'
import NewProjectModal from '../components/common/NewProjectModal'

export const MainMenuPage = () => {
  const projects = usePersistentStore((state) => state.projects)
  const [isNewProjectModalOpen, setNewProjectModalOpen] = React.useState(false)

  return (
    <>
      <CustomAppBar />
      <Grid sx={{ flexGrow: 1 }} container spacing={2}>
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
                  <IconButton
                    color='primary'
                    aria-label='add to shopping cart'
                    onClick={() => {
                      setNewProjectModalOpen(true)
                    }}
                  >
                    <AddCircleIcon fontSize='large' />
                  </IconButton>
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
    </>
  )
}
