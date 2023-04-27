import { Container, Stack, Typography, TextField } from '@mui/material'
import { useCallback } from 'react'
import { GetElementType, FlowFieldsToDisplay } from '../processModels/FlowUtil'
import { Edge, Node } from 'reactflow'
import { shallow } from 'zustand/shallow'
import { EditorState, useEditorStore } from '../editorStore/flowStore'

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
    }),
    []
  )

  const { selectedElement, selectElement } = useEditorStore(selector, shallow)

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

  const fieldsToDisplayL = displayData
    ? displayData
    : selectedElement
    ? Object.keys(selectedElement.data)
    : []

  const selectedElementProperties =
    selectedElement && fieldsToDisplayL ? (
      [
        <div key='NodeLabel'>
          <TextField
            value={selectedElement.type}
            disabled={true}
            variant='standard'
          ></TextField>
        </div>,
      ].concat(
        Object.entries(selectedElement.data)
          .filter(([key, value]) => fieldsToDisplayL.includes(key))
          .map(([key, value]) => (
            <div key={key}>
              <TextField
                label={key}
                variant='outlined'
                type={NodeDataFieldsTypesAsStrings(key)}
                value={value}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  updateNodeFields({ [key]: event.target.value })
                }}
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
        {/* TODO: Center this */}
        {selectedElementProperties}
      </Stack>
    </Container>
  )
}
