import { Grid } from '@mui/material'
import { petriNet1, petriNet2, ProcessModel } from '@synthchron/simulator'
import { CustomAppBar } from '../components/CustomAppBar'
import { ProjectCard } from '../components/ProjectCard'

export const MainMenuPage = () => {
  const projects: ProcessModel[] = [
    petriNet1,
    petriNet2,
    petriNet1,
    petriNet2,
    petriNet1,
    petriNet2,
    petriNet1,
    petriNet2,
  ]

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
          <Grid container justifyContent={'center'} spacing={2} xs={12}>
            <Grid item xs={9}>
              <Grid container spacing={2} xs={12}>
                {projects.map((value, index) => (
                  <Grid key={index} item xs={4}>
                    <ProjectCard processModel={value} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
