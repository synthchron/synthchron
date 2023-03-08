import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material'
import moment from 'moment'
import { Project } from '../types/project'
import { usePersistentStore } from './common/persistentStore'

interface ProjectCardProps {
  projectId: string
  project: Project
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  projectId,
}) => {
  const removeProject = usePersistentStore((state) => state.removeProject)

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
          {project.projectModel.type}
        </Typography>
        <Typography variant='h5' component='div'>
          {project.projectName}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color='text.secondary'>
          {moment(project.lastEdited).fromNow()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button href={`/editor/${projectId}`}>Edit</Button>
        <Button onClick={() => alert('Not implemented')}>Clone</Button>
        <Button onClick={() => removeProject(projectId)} color='error'>
          Delete
        </Button>
      </CardActions>
    </Card>
  )
}
