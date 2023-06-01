import { TabbedDrawer } from './TabbedDrawer'
import { PropertiesAndGeneralTab } from './rightSidebar/PropertiesAndGeneralTab'
import { SimulationTab } from './rightSidebar/SimulationTab'

export const RightSidebar = () => {
  return (
    <TabbedDrawer side='right' tabs={['Properties', 'Verify']}>
      <PropertiesAndGeneralTab />
      <SimulationTab />
    </TabbedDrawer>
  )
}
