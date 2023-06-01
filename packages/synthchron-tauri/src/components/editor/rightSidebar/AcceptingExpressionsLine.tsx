import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { Box, IconButton, TextField } from '@mui/material'
import { compileExpression } from 'filtrex'

import { AcceptingExpression } from '@synthchron/simulator'

import { useEditorStore } from '../editorStore/flowStore'

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

interface AcceptingExpressionsLineProps {
  expression: AcceptingExpression
  updateExpression: (expression: AcceptingExpression) => void
  deleteExpression: () => void
  placeholder: string
}

export const AcceptingExpressionsLine: React.FC<
  AcceptingExpressionsLineProps
> = ({ expression, updateExpression, deleteExpression, placeholder }) => {
  const nodes = useEditorStore((state) => state.nodes)

  const error = computeExpressionError(
    expression.expression,
    nodes.filter((n) => n.type == 'Place').map((n) => n.data.label)
  )

  return (
    <Box
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
          value={expression.name}
          onChange={(e) => {
            updateExpression({
              ...expression,
              name: e.target.value,
            })
          }}
          error={expression.name == ''}
          variant='outlined'
          size='small'
          placeholder='name'
        />
        <TextField
          sx={{
            flexGrow: 2,
            marginLeft: '-1px',
            '& .MuiOutlinedInput-input': {
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
          value={expression.expression}
          onChange={(e) => {
            updateExpression({
              ...expression,
              expression: e.target.value,
            })
          }}
          error={error.error}
          helperText={error.message}
          variant='outlined'
          size='small'
          placeholder={placeholder}
        />
      </div>
      <IconButton onClick={deleteExpression}>
        <RemoveCircleOutlineIcon />
      </IconButton>
    </Box>
  )
}
