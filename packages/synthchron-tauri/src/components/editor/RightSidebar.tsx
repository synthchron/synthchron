import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { EditorState, useEditorStore } from './editorStore/flowStore'
import { Stack, TextField, Typography } from '@mui/material'
import { TabbedDrawer } from './TabbedDrawer'
import { GeneralTab } from './rightSidebar/GeneralTab'
import { SimulationTab } from './rightSidebar/SimulationTab'

export const RightSidebar = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selector = useCallback(
    (state: EditorState) => ({
      selectedElement: state.selectedElement,
    }),
    []
  )

  const { selectedElement } = useEditorStore(selector, shallow)

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
