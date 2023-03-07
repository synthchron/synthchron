import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material'
import { ProcessModel } from '@synthchron/simulator'

interface ProjectCardProps {
  processModel: ProcessModel
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ processModel }) => {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
          {processModel.type}
        </Typography>
        <Typography variant='h5' component='div'>
          My Project 1
        </Typography>
        <Typography sx={{ mb: 1.5 }} color='text.secondary'>
          {new Date().toLocaleString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button href='/editor/processmodelid'>Edit</Button>
        <Button onClick={() => alert('Not implemented')}>Clone</Button>
        <Button onClick={() => alert('Not implemented')} color='error'>
          Delete
        </Button>
      </CardActions>
    </Card>
  )
}
