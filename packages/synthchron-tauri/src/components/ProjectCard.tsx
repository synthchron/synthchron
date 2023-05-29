import { useState } from 'react'

import { CloudDownload } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from '@mui/material'
import moment from 'moment'
import { Link, useNavigate } from 'react-router-dom'

import { Project } from '../types/project'
import { ConfirmationDialog } from './ConfirmationDialog'
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
  const [deletionDialogOpen, setDeletionDialogOpen] = useState(false)

  const removeProject = usePersistentStore((state) => state.removeProject)

  const updateProject = usePersistentStore((state) => state.updateProject)

  const addProject = usePersistentStore((state) => state.addProject)

  const flow = petriNetFlowConfig.generateFlow(project.projectModel)

  const navigate = useNavigate()

  return (
    <Card sx={{}}>
      <CardMedia
        component='div'
        style={{
          height: 150,
          cursor: 'pointer',
          pointerEvents: 'none',
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
          sx={{ textTransform: 'capitalize', mb: 0 }}
          color='text.secondary'
          fontSize={14}
          gutterBottom
        >
          {project.projectModel.type}
        </Typography>
        <Typography
          variant='h5'
          component='div'
          noWrap
          title={project.projectName}
        >
          {project.projectName}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color='text.secondary' fontSize={14}>
          last edited {moment(project.lastEdited).fromNow()}
        </Typography>
        <Typography
          sx={{
            overflow: 'hidden',
            fontSize: '0.70rem',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '3',
            WebkitBoxOrient: 'vertical',
          }}
          variant='body2'
          title={project.projectDescription}
        >
          {project.projectDescription}
        </Typography>
      </CardContent>

      <CardActions
        style={{
          alignSelf: 'flex-end',
          justifyContent: 'flex-end',
        }}
      >
        <IconButton
          to={`/editor/${projectId}`}
          component={Link}
          onClick={() => {
            updateProject(projectId, {
              lastOpened: new Date().toJSON(),
            })
          }}
          title='Edit project'
        >
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            addProject({
              ...project,
              projectName: `${project.projectName} (copy)`,
              lastOpened: new Date().toJSON(),
              lastEdited: new Date().toJSON(),
            })
          }}
          style={{
            marginLeft: '8px',
          }}
          title='Duplicate project'
        >
          <FileCopyIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            const processModel = project.projectModel
            const processModelJson = JSON.stringify(processModel, null, 2)
            const blob = new Blob([processModelJson], {
              type: 'application/json',
            })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.download = `${project.projectName.replace(/ /g, '_')}-${new Date()
              .toDateString()
              .replace(/ /g, '_')}.json`
            a.href = url
            a.click()
            URL.revokeObjectURL(url)
          }}
          style={{
            marginLeft: '8px',
          }}
          title='Export proces model'
        >
          <CloudDownload />
        </IconButton>
        <IconButton
          onClick={() => setDeletionDialogOpen(true)}
          color='error'
          title='Delete project'
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
      <ConfirmationDialog
        text='Are you sure you want to delete this project?'
        open={deletionDialogOpen}
        closeDialog={() => setDeletionDialogOpen(false)}
        onConfirm={() => removeProject(projectId)}
        useErrorColor
      />
    </Card>
  )
}
