import { TabbedDrawer } from './TabbedDrawer'
import { CollaborationTab } from './leftSidebar/CollaborationTab'
import { CreatorTab } from './leftSidebar/CreatorTab'
import { ProjectTab } from './leftSidebar/ProjectTab'

export const LeftSidebar = () => (
  <TabbedDrawer side='left' tabs={['Project', 'Creator', 'Collab']}>
    <ProjectTab />
    <CreatorTab />
    <CollaborationTab />
  </TabbedDrawer>
)
