import AddIcon from '@mui/icons-material/Add'
import ControlPointIcon from '@mui/icons-material/ControlPoint'
import {
  Button,
  Container,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material'

import { ProcessModelType } from '@synthchron/simulator'

import { useEditorStore } from '../editorStore/flowStore'
import { PetriNetMeta } from '../processModels/petriNet/petriNetFlowConfig'
import { AcceptingExpressionsLine } from './AcceptingExpressionsLine'

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
      <Typography variant='h6' gutterBottom>
        Project
      </Typography>
      {processModelFlowConfig.processModelType == ProcessModelType.PetriNet && (
        <Paper
          sx={{
            padding: '16px',
          }}
        >
          <Typography variant='subtitle1'>Accepting Expressions</Typography>
          {(meta as PetriNetMeta).acceptingExpressions.map(
            (expression, index) => (
              <AcceptingExpressionsLine
                key={index}
                expression={expression}
                updateExpression={(expression) => {
                  const newAcceptingExpressions = [
                    ...(meta as PetriNetMeta).acceptingExpressions,
                  ]
                  newAcceptingExpressions[index] = expression
                  setMeta({
                    acceptingExpressions: newAcceptingExpressions,
                  })
                }}
                deleteExpression={() => {
                  const newAcceptingExpressions = [
                    ...(meta as PetriNetMeta).acceptingExpressions,
                  ]
                  newAcceptingExpressions.splice(index, 1)
                  setMeta({
                    acceptingExpressions: newAcceptingExpressions,
                  })
                }}
                placeholder={
                  exampleExpressions[index % exampleExpressions.length]
                }
              />
            )
          )}
          <Tooltip title='Add accepting condition'>
            <Paper
              style={{
                backgroundColor: 'lightgrey',
                width: '100%',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
                cursor: 'pointer',
                height: '2rem',
                marginTop: '0.5em',
              }}
              onClick={() => {
                setMeta({
                  acceptingExpressions: [
                    ...(meta as PetriNetMeta).acceptingExpressions,
                    { name: '', expression: '' },
                  ],
                })
              }}
            >
              <AddIcon />
            </Paper>
          </Tooltip>
        </Paper>
      )}
    </Container>
  )
}
