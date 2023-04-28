import { TabbedDrawer } from './TabbedDrawer'
import { GeneralTab } from './rightSidebar/GeneralTab'
import { PropertiesTab } from './rightSidebar/PropertiesTab'
import { SimulationTab } from './rightSidebar/SimulationTab'

export const RightSidebar = () => {
  return (
    <TabbedDrawer side='right' tabs={['Properties', 'General', 'Simulator']}>
      <PropertiesTab />
      <GeneralTab />
      <SimulationTab />
    </TabbedDrawer>
  )
}
