import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { RFState, useFlowStore } from './ydoc/flowStore'
import { Stack, TextField, Typography } from '@mui/material'
import { DrawerWrapper } from './DrawerWrapper'
import { TabbedDrawer } from './TabbedDrawer'
import { GeneralTab } from './rightSidebar/GeneralTab'

export const RightSidebar = () => {
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
    <TabbedDrawer side='right' tabs={['Properties', 'General']}>
      <>
        <Stack spacing={2}>
          <Typography variant='h6'>Properties</Typography>
          {/* TODO: Center this */}
          {selectedElementProperties}
        </Stack>
      </>
      <GeneralTab />
    </TabbedDrawer>
  )
}
