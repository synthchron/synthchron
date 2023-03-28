import { TabbedDrawer } from './TabbedDrawer'
import { CollaborationTab } from './leftSidebar/CollaborationTab'
import { CreatorTab } from './leftSidebar/CreatorTab'
import { ProjectTab } from './leftSidebar/ProjectTab'

export const LeftSidebar = () => {
  // This code should be kept but not here
  /* const transformTest = () => {
    console.log(transformFlowToSimulator(useFlowStore.getState()))
  }
  const simulate = () => {
    console.log(
      simulateWithEngine(
        transformFlowToSimulator(
          useFlowStore.getState()
        ) as PetriNetProcessModel,
        { endOnAcceptingState: true, minEvents: 1, maxEvents: 100 },
        petriNetEngine
      )
    )
  } */

  return (
    <>
      <TabbedDrawer side='left' tabs={['Project', 'Creator', 'Collab']}>
        <ProjectTab />
        <CreatorTab />
        <CollaborationTab />
      </TabbedDrawer>
    </>
  )
  /* <aside>
      <Button onClick={transformTest}> Transform </Button>
      
      <Button
        onClick={() => {
          if (projectId) {
            saveFlow(projectId)
          } else {
            console.log('No project id') // TODO: Create project
          }
        }}
      >
        Save
      </Button>
      <Button onClick={simulate}>Simulate</Button>
    </aside> */
}
