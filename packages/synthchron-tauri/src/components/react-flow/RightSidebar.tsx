import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { RFState, useFlowStore } from './ydoc/flowStore'
import { Stack, TextField, Typography } from '@mui/material'
import { TabbedDrawer } from './TabbedDrawer'
import { GeneralTab } from './rightSidebar/GeneralTab'
import { SimulationTab } from './rightSidebar/SimulationTab'
import { Edge, Node } from 'reactflow'

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
    (state: RFState) => ({
      selectedElement: state.selectedElement,
      selectElement: state.selectElement,
      nodes: state.nodes,
      edges: state.edges,
    }),
    []
  )
  const { selectedElement, selectElement } = useFlowStore(selector, shallow)

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

  const selectedElementProperties = selectedElement ? (
    Object.entries(selectedElement.data).map(([key, value]) => (
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
