import ControlPointIcon from '@mui/icons-material/ControlPoint'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import {
  Box,
  Container,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { compileExpression } from 'filtrex'

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

const computeExpressionError = (
  expression: string,
  existing_nodes: string[]
) => {
  if (expression === '')
    return { error: true, message: 'Expression cannot be empty' }
  try {
    const usedVars: string[] = []
    const options = {
      customProp: (
        varName: string,
        _get: (v: string) => unknown,
        _obj: object
      ) => {
        usedVars.push(varName)
        return 0
      },
    }
    compileExpression(expression, options)({})
    console.log('used vars', usedVars.join(', '))
    console.log('existing vars', existing_nodes.join(', '))
    const unusedVars = usedVars.filter((v) => !existing_nodes.includes(v))
    if (unusedVars.length > 0)
      return {
        error: true,
        message: `Unknown variable: ${unusedVars[0].substring(0, 10)}`,
      }
  } catch (e) {
    return { error: true, message: 'Parse error' }
  }

  return { error: false, message: '' }
}

export const GeneralTab: React.FC = () => {
  const meta = useEditorStore((state) => state.meta)
  const setMeta = useEditorStore((state) => state.setMeta)

  const nodes = useEditorStore((state) => state.nodes)

  console.log(nodes)
  console.log(nodes.filter((n) => n.type == 'Place').map((n) => n.id))

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
            ({ name, expression }, index) => {
              const error = computeExpressionError(
                expression,
                nodes.filter((n) => n.type == 'Place').map((n) => n.id)
              )

              return (
                <Box
                  key={index}
                  sx={{
                    marginTop: '0.5em',
                    alignItems: 'start',
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      //alignItems: 'center',
                      width: '30vw',
                    }}
                  >
                    <TextField
                      sx={{
                        width: '30%',
                        padding: 0,
                        '& .MuiOutlinedInput-input': {
                          paddingLeft: 1, // <-- added zero padding instruction
                          paddingRight: 1, // <-- added zero padding instruction
                        },
                        '& .MuiOutlinedInput-root': {
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0,
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          // only half of the right border oppacity
                          borderRight: '1px solid rgba(0, 0, 0, 0.23)',
                        },
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
                      error={name == ''}
                      variant='outlined'
                      size='small'
                      placeholder='name'
                    />
                    <TextField
                      sx={{
                        flexGrow: 2,
                        marginLeft: '-1px',
                        '& .MuiOutlinedInput-input': {
                          //borderWidth: 0,
                          //outline: 'none',
                          //borderColor: 'white !important',
                          paddingLeft: 1, // <-- added zero padding instruction
                          paddingRight: 1, // <-- added zero padding instruction
                        },
                        '& .MuiOutlinedInput-root': {
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          // only half of the left border oppacity
                          borderLeft: '1px solid rgba(0, 0, 0, 0.23)',
                        },
                      }}
                      value={expression}
                      onChange={(e) => {
                        const newAcceptingExpressions = [
                          ...(meta as PetriNetMeta).acceptingExpressions,
                        ]
                        newAcceptingExpressions[index].expression =
                          e.target.value
                        setMeta({
                          acceptingExpressions: newAcceptingExpressions,
                        })
                      }}
                      error={error.error}
                      helperText={error.message}
                      variant='outlined'
                      size='small'
                      placeholder={
                        exampleExpressions[index % exampleExpressions.length]
                      }
                    />
                  </div>
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
            }
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
