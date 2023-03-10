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
      <CardContent
        sx={{
          height: 150,
        }}
      >
        <Typography
          sx={{ fontSize: 14, textTransform: 'capitalize' }}
          color='text.secondary'
          gutterBottom
        >
          {project.projectModel.type}
        </Typography>
        <Typography variant='h5' component='div' noWrap>
          {project.projectName}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color='text.secondary'>
          {/* {moment(project.lastEdited).fromNow()} */}
          {moment(project.lastEdited).fromNow()}
        </Typography>
        <Typography
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '3',
            WebkitBoxOrient: 'vertical',
          }}
          variant='body2'
        >
          {project.projectDescription}
        </Typography>
      </CardContent>
      <CardActions
        style={{
          alignSelf: 'flex-end',
        }}
      >
        <Button href={`/editor/${projectId}`}>Edit</Button>
        <Button onClick={() => alert('Not implemented')}>Clone</Button>
        <Button onClick={() => removeProject(projectId)} color='error'>
          Delete
        </Button>
      </CardActions>
    </Card>
  )
}
