import { Grid, IconButton } from '@mui/material'
import { petriNet1 } from '@synthchron/simulator'
import { usePersistentStore } from '../components/common/persistentStore'
import { CustomAppBar } from '../components/CustomAppBar'
import { ProjectCard } from '../components/ProjectCard'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { faker } from '@faker-js/faker'

import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'

const modal_style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

export const MainMenuPage = () => {
  const projects = usePersistentStore((state) => state.projects)
  const addProject = usePersistentStore((state) => state.addProject)
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

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
                    onClick={handleOpen}
                    // onClick={() => {
                    //   addProject({
                    //     projectName: faker.animal.bird(),
                    //     projectDescription: faker.lorem.lines(3),
                    //     projectModel: petriNet1,
                    //     created: new Date().toJSON(),
                    //     lastEdited: new Date().toJSON(),
                    //   })
                    // }}
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
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={modal_style}>
            <Typography id='modal-modal-title' variant='h6' component='h2'>
              Text in a modal
            </Typography>
            <Typography id='modal-modal-description' sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </Box>
        </Modal>
      </div>
    </>
  )
}
