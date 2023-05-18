import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material'
import moment from 'moment'
import { Link, useNavigate } from 'react-router-dom'

import { Project } from '../types/project'
import { FlowPreview } from './common/FlowPreview'
import { usePersistentStore } from './common/persistentStore'
import { petriNetFlowConfig } from './editor/processModels/petriNet/petriNetFlowConfig'

const fitViewOptions = { padding: 0.1, minZoom: 0.1, maxZoom: 100 }

interface ProjectCardProps {
  projectId: string
  project: Project
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  projectId,
}) => {
  const removeProject = usePersistentStore((state) => state.removeProject)

  const updateProject = usePersistentStore((state) => state.updateProject)

  const flow = petriNetFlowConfig.generateFlow(project.projectModel)

  const navigate = useNavigate()

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardMedia
        component='div'
        style={{
          height: 150,
        }}
        onClick={() => {
          updateProject(projectId, {
            lastEdited: new Date().toJSON(),
          })
          navigate(`/editor/${projectId}`)
        }}
      >
        <FlowPreview
          nodes={flow.nodes}
          edges={flow.edges}
          nodeTypes={petriNetFlowConfig.nodeTypes}
          edgeTypes={petriNetFlowConfig.edgeTypes}
          fitViewOptions={fitViewOptions}
        />
      </CardMedia>
      <CardContent
        sx={{
          height: 100,
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
          last edited {moment(project.lastEdited).fromNow()}
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
        <Button
          to={`/editor/${projectId}`}
          component={Link}
          onClick={() => {
            updateProject(projectId, {
              lastOpened: new Date().toJSON(),
            })
          }}
        >
          Edit
        </Button>
        <Button onClick={() => alert('Not implemented')}>Clone</Button>
        <Button onClick={() => removeProject(projectId)} color='error'>
          Delete
        </Button>
      </CardActions>
    </Card>
  )
}
