import ControlPointIcon from '@mui/icons-material/ControlPoint'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import {
  Box,
  Container,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'

import { ProcessModelType } from '@synthchron/simulator'

import { useEditorStore } from '../editorStore/flowStore'
import { PetriNetMeta } from '../processModels/petriNet/petriNetFlowConfig'

const exampleExpressions = [
  'p1 > 1 and p2 <= 4',
  'p1 == p3',
  'p1 * p2 == 0',
  'p1 mod 2 == 1',
  'p1 > 0 or p2 > 0',
]

export const GeneralTab: React.FC = () => {
  const meta = useEditorStore((state) => state.meta)
  const setMeta = useEditorStore((state) => state.setMeta)

  const processModelFlowConfig = useEditorStore(
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
                  placeholder='name'
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
                  placeholder={
                    exampleExpressions[index % exampleExpressions.length]
                  }
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
