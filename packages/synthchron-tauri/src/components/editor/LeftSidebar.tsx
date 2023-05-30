import { TabbedDrawer } from './TabbedDrawer'
import { CreatorTab } from './leftSidebar/CreatorTab'
import { ProjectTab } from './leftSidebar/ProjectTab'

export const LeftSidebar = () => (
  <TabbedDrawer side='left' tabs={['Project', 'Creator']}>
    <ProjectTab />
    <CreatorTab />
  </TabbedDrawer>
)
