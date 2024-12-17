import { Box, FormControlLabel, Switch } from '@mui/material'
import { useEditorStore } from './editorStore/flowStore'
import { TabbedDrawer } from './TabbedDrawer'
import { PropertiesAndGeneralTab } from './rightSidebar/PropertiesAndGeneralTab'
import { SimulationTab } from './rightSidebar/SimulationTab'

export const RightSidebar = () => {
  const [displayFullTransitionName, setDisplayFullTransitionName] = useEditorStore(
    (state) => [state.displayFullTransitionName, state.setDisplayFullTransitionName]
  )

  return (
    <TabbedDrawer side='right' tabs={['Properties', 'Verify']}>
      <PropertiesAndGeneralTab />
      <SimulationTab />
      <Box sx={{ padding: '16px' }}>
        <FormControlLabel
          control={
            <Switch
              checked={displayFullTransitionName}
              onChange={(event) => setDisplayFullTransitionName(event.target.checked)}
              name='displayFullTransitionName'
              color='primary'
            />
          }
          label='Display Full Transition Name'
        />
      </Box>
    </TabbedDrawer>
  )
}
