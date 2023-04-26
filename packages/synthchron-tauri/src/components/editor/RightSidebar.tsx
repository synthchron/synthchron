import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { EditorState, useEditorStore } from './editorStore/flowStore'
import { Stack, TextField, Typography } from '@mui/material'
import { TabbedDrawer } from './TabbedDrawer'
import { GeneralTab } from './rightSidebar/GeneralTab'
import { SimulationTab } from './rightSidebar/SimulationTab'
import { Edge, Node } from 'reactflow'
import { FlowFieldsToDisplay } from './processModels/petriNet/ChangeableFlowProperties'

type NodeDataFields = {
  //List of field that can be updated from property window.
  //They are all under the data field of both nodes and edges.
  label: string
  store: number
  accepting: string
  weight: number
}

function NodeDataFieldsTypesAsStrings(field: string) {
  //This is made for changing fields of nodes and edges
  //We only really care about type for values textfields that should only accept numbers
  switch (field) {
    case 'store':
      return 'number'
    case 'weight':
      return 'number'
    default:
      return ''
  }
}

export const RightSidebar = () => {
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
      if ('position' in selectedElement) {
        //Element is a node
        const updatedSelectedElement: Node = {
          ...selectedElement,
          data: {
            ...selectedElement.data,
            ...fields,
          },
        }
        selectElement(updatedSelectedElement)
      } else {
        //Element is an edge
        const updatedSelectedElement: Edge = {
          ...selectedElement,
          data: {
            ...selectedElement.data,
            ...fields,
          },
        }
        selectElement(updatedSelectedElement)
      }
    }
  }

  const displayData = selectedElement
    ? FlowFieldsToDisplay[
        selectedElement.data.label as keyof typeof FlowFieldsToDisplay
      ]
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
            defaultValue={selectedElement.data.label}
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
                defaultValue={value}
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
    <TabbedDrawer side='right' tabs={['Properties', 'General', 'Simulator']}>
      <>
        <Stack spacing={2}>
          <Typography variant='h6'>Properties</Typography>
          {/* TODO: Center this */}
          {selectedElementProperties}
        </Stack>
      </>
      <GeneralTab />
      <SimulationTab />
    </TabbedDrawer>
  )
}
