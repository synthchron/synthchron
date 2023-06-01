import { useCallback } from 'react'

import { Paper, Stack, Typography } from '@mui/material'
import { Edge, Node } from 'reactflow'
import { shallow } from 'zustand/shallow'

import { EditorState, useEditorStore } from '../editorStore/flowStore'
import { FlowFieldsToDisplay, GetElementType } from '../processModels/FlowUtil'
import { OtherProperty } from './CustomProperties/OtherProperties'
import { LabelProperty } from './CustomProperties/PlaceLabelProperty'

export type NodeDataFields = {
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
      changeSelectedPlaceLabel: state.changeSelectedPlaceLabel,
    }),
    []
  )

  const { selectedElement, selectElement, changeSelectedPlaceLabel } =
    useEditorStore(selector, shallow)

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
      Object.entries(selectedElement.data)
        .filter(([key, _value]) => fieldsToDisplay.includes(key))
        .map(([key, value]) => (
          <div key={key}>
            {key === 'label' && selectedElement.type === 'Place' ? (
              <LabelProperty
                value={value as string}
                changeSelectedPlaceLabel={changeSelectedPlaceLabel}
              />
            ) : (
              <OtherProperty
                value={value as string}
                NonReactKey={key}
                type={NodeDataFieldsTypesAsStrings(key)}
                updateNodeFields={updateNodeFields}
              />
            )}
          </div>
        ))
    ) : (
      <></>
    )

  if (!(selectedElement && fieldsToDisplay)) {
    return (
      <Paper
        sx={{
          padding: '16px',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          display: 'flex',
        }}
      >
        <Typography variant='caption'>No element selected</Typography>
      </Paper>
    )
  }

  return (
    <Paper
      sx={{
        padding: '16px',
      }}
    >
      <Stack spacing={2}>
        <Typography variant='h6'>
          {selectedElement.type} ({selectedElement.data.label})
        </Typography>
        {selectedElementProperties}
      </Stack>
    </Paper>
  )
}
