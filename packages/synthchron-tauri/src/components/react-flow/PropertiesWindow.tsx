import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { RFState, useFlowStore } from './ydoc/flowStore'
import './propertiesWindow.css'
import { Stack, TextField } from '@mui/material'
import internal from 'stream'
import { Edge, Node } from 'reactflow'

type NodeDataFields = {
  //List of field that can be updated from property window.
  //They are all under the data field of both nodes and edges.
  label: string
  store: number
  accepting: string
  weight: number
}

export const PropertiesWindow = () => {
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
    console.log(fields)
  }

  const selectedElementProperties = selectedElement ? (
    Object.entries(selectedElement.data).map(([key, value]) => (
      <div key={key}>
        <TextField
          label={key}
          variant='outlined'
          type={typeof value}
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
    <aside
      className='PropertiesWindow'
      style={{ display: selectedElement ? 'block' : 'none' }}
    >
      <Stack spacing={2} className='PropertyContainer'>
        <div className='PropertiesTitle'>Properties Window</div>
        {selectedElementProperties}
      </Stack>
    </aside>
  )
}
