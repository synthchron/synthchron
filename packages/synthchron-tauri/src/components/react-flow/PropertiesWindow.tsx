import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { RFState, useFlowStore } from './ydoc/flowStore'
import './propertiesWindow.css'
import { Stack, TextField } from '@mui/material'

export const PropertiesWindow = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selector = useCallback(
    (state: RFState) => ({
      selectedElement: state.selectedElement,
    }),
    []
  )

  const { selectedElement } = useFlowStore(selector, shallow)

  const selectedElementProperties = selectedElement ? (
    Object.entries(selectedElement.data).map(([key, value]) => (
      <div key={key}>
        <TextField
          label={key}
          variant='outlined'
          defaultValue={JSON.stringify(value)}
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
