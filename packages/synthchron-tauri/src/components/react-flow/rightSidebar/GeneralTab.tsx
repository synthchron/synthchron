import {
  Box,
  Container,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { ProcessModelType } from '@synthchron/simulator'
import { useParams } from 'react-router-dom'
import { usePersistentStore } from '../../common/persistentStore'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import ControlPointIcon from '@mui/icons-material/ControlPoint'
import { useFlowStore } from '../ydoc/flowStore'
import { PetriNetMeta } from '../processModels/petriNet/petriNetFlowConfig'

export const GeneralTab: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const projects = usePersistentStore((state) => state.projects)
  const meta = useFlowStore((state) => state.meta)
  const setMeta = useFlowStore((state) => state.setMeta)

  const processModelFlowConfig = useFlowStore(
    (state) => state.processModelFlowConfig
  )

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: '1em',
      }}
    >
      <Typography variant='h6'>Project</Typography>
      {processModelFlowConfig.processModelType == ProcessModelType.PetriNet && (
        <>
          <Typography variant='subtitle1'>Accepting Expressions</Typography>
          {(meta as PetriNetMeta).acceptingExpressions.map(
            ({ name, expression }, index) => (
              <Box
                key={index}
                sx={{
                  marginTop: '0.5em',
                  justifyContent: 'space-between',
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                }}
              >
                <TextField
                  sx={{
                    width: '25%',
                    marginRight: '0.25em',
                  }}
                  value={name}
                  onChange={(e) => {
                    const newAcceptingExpressions = [
                      ...(meta as PetriNetMeta).acceptingExpressions,
                    ]
                    newAcceptingExpressions[index].name = e.target.value
                    setMeta({
                      acceptingExpressions: newAcceptingExpressions,
                    })
                  }}
                  variant='outlined'
                  size='small'
                />
                <TextField
                  sx={{
                    width: '55%',
                  }}
                  value={expression}
                  onChange={(e) => {
                    const newAcceptingExpressions = [
                      ...(meta as PetriNetMeta).acceptingExpressions,
                    ]
                    newAcceptingExpressions[index].expression = e.target.value
                    setMeta({
                      acceptingExpressions: newAcceptingExpressions,
                    })
                  }}
                  variant='outlined'
                  size='small'
                />
                <IconButton
                  sx={{}}
                  onClick={() => {
                    const newAcceptingExpressions = [
                      ...(meta as PetriNetMeta).acceptingExpressions,
                    ]
                    newAcceptingExpressions.splice(index, 1)
                    setMeta({
                      acceptingExpressions: newAcceptingExpressions,
                    })
                  }}
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Box>
            )
          )}
        </>
      )}
      <IconButton
        onClick={() =>
          setMeta({
            acceptingExpressions: [
              ...(meta as PetriNetMeta).acceptingExpressions,
              { name: '', expression: '' },
            ],
          })
        }
      >
        <ControlPointIcon />
      </IconButton>
    </Container>
  )
}
