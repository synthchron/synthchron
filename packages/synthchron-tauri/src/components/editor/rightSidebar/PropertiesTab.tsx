import { useCallback, useEffect, useRef, useState } from 'react'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import {
  Container,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Edge, Node } from 'reactflow'
import { shallow } from 'zustand/shallow'

import { EditorState, useEditorStore } from '../editorStore/flowStore'
import { FlowFieldsToDisplay, GetElementType } from '../processModels/FlowUtil'

type NodeDataFields = {
  //List of fields that can be updated from property window.
  //They are all under the data field of both nodes and edges.
  label: string
  tokens: number
  accepting: string //Not used, but not problematic.
  weight: number
  multiplicity: number
}

function NodeDataFieldsTypesAsStrings(field: string) {
  //This is made for changing fields of nodes and edges
  //We only really care about type for values textfields that should only accept numbers
  switch (field) {
    case 'tokens':
      return 'number'
    case 'weight':
      return 'number'
    case 'multiplicity':
      return 'number'
    default:
      return ''
  }
}

export const PropertiesTab: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selector = useCallback(
    (state: EditorState) => ({
      selectedElement: state.selectedElement,
      selectElement: state.selectElement,
      changeIdOfSelectedElement: state.changeIdOfSelectedElement,
    }),
    []
  )

  const { selectedElement, selectElement, changeIdOfSelectedElement } =
    useEditorStore(selector, shallow)
  const [idValue, setIdValue] = useState(selectedElement?.id ?? '')
  const prevNodeRef = useRef(idValue)

  useEffect(() => {
    //When new node is selected, change the value of the ID-textfield
    if (selectedElement && selectedElement?.id !== idValue) {
      setIdValue(selectedElement.id)
      prevNodeRef.current = selectedElement.id
    }
  }, [selectedElement])

  const updateNodeFields = (fields: Partial<NodeDataFields>) => {
    if (selectedElement) {
      const elemType = GetElementType(selectedElement.type)
      if (elemType == 'node') {
        const updatedSelectedElement: Node = {
          ...(selectedElement as Node),
          data: {
            ...selectedElement.data,
            ...fields,
          },
        }
        selectElement(updatedSelectedElement)
      } else if (elemType == 'edge') {
        //Element is an edge
        const updatedSelectedElement: Edge = {
          ...(selectedElement as Edge),
          data: {
            ...selectedElement.data,
            ...fields,
          },
        }
        selectElement(updatedSelectedElement)
      }
    }
  }

  const displayData =
    selectedElement && selectedElement.type
      ? FlowFieldsToDisplay[selectedElement.type]
      : null

  const fieldsToDisplay = displayData
    ? displayData
    : selectedElement
    ? Object.keys(selectedElement.data)
    : []

  const selectedElementProperties =
    selectedElement && fieldsToDisplay ? (
      [
        <div key='NodeLabel'>
          <TextField
            value={selectedElement.type}
            disabled={true}
            variant='standard'
          ></TextField>
        </div>,
        <div key='NodeID'>
          <Paper
            elevation={1}
            sx={{
              p: '2px 20px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextField
              sx={{ flex: 1 }}
              defaultValue={selectedElement.id}
              variant='standard'
              label={'ID'}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                event.target.value
                  ? changeIdOfSelectedElement(event.target.value)
                  : null
              }
              //onKeyDown={Call ID Change}
            ></TextField>
            <Divider sx={{ height: 28, m: 2 }} orientation='vertical' />
            <IconButton
              //onClick={() => console.log('Awesome')}
              component='button'
            >
              <CheckCircleIcon transform='scale(1.3)' color='primary' />
            </IconButton>
          </Paper>
        </div>,
      ].concat(
        Object.entries(selectedElement.data)
          .filter(([key, _value]) => fieldsToDisplay.includes(key))
          .map(([key, value]) => (
            <div key={key}>
              <TextField
                label={key}
                variant='outlined'
                type={NodeDataFieldsTypesAsStrings(key)}
                value={value}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (NodeDataFieldsTypesAsStrings(key) === 'number') {
                    if (
                      Number.isNaN(parseInt(event.target.value)) &&
                      !(event.target.value === '')
                    ) {
                      event.preventDefault
                    } else {
                      const resNumber = Number(event.target.value) * 1
                      updateNodeFields({
                        [key]: resNumber,
                      })
                      event.target.value = resNumber.toString()
                    }
                  } else {
                    updateNodeFields({ [key]: event.target.value })
                  }
                }}
                /*{...(key === 'label' && selectedElement.type === 'Place'
                  ? {
                      onChange: (
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        console.log('test')
                      },
                    }
                  : {
                      onChange: (
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        if (NodeDataFieldsTypesAsStrings(key) === 'number') {
                          if (
                            Number.isNaN(parseInt(event.target.value)) &&
                            !(event.target.value === '')
                          ) {
                            event.preventDefault
                          } else {
                            const resNumber = Number(event.target.value) * 1
                            updateNodeFields({
                              [key]: resNumber,
                            })
                            event.target.value = resNumber.toString()
                          }
                        } else {
                          updateNodeFields({ [key]: event.target.value })
                        }
                      },
                    })}*/
              ></TextField>
            </div>
          ))
      )
    ) : (
      <></>
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
      <Stack spacing={2}>
        <Typography variant='h6'>Properties</Typography>
        {selectedElementProperties}
      </Stack>
    </Container>
  )
}
