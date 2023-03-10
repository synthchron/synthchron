import { Button } from '@mui/material'
import { useCallback } from 'react'
import { useParams } from 'react-router'
import { shallow } from 'zustand/shallow'
import { transformFlowToSimulator } from '../flowTransformer'
import useStore, { RFState } from './flowStore'
import './sidebar.css'

export const Sidebar = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }
  const transformTest = () => {
    console.log(transformFlowToSimulator(useStore.getState()))
  }
  const selector = useCallback(
    (state: RFState) => ({
      nodeTypes: state.processModelFlowConfig.nodeTypes,
      saveFlow: state.saveFlow,
    }),
    []
  )

  const { nodeTypes, saveFlow } = useStore(selector, shallow)

  const { projectId } = useParams<{ projectId: string }>()

  return (
    <aside>
      <div className='description'>
        You can drag these nodes to the pane on the right.
      </div>
      {Object.keys(nodeTypes).map((key) => (
        <div
          className='dndnode'
          key={key}
          onDragStart={(event) => onDragStart(event, key)}
          draggable
        >
          {key}
        </div>
      ))}
      <Button onClick={transformTest}> Transform </Button>
      <Button onClick={() => projectId && saveFlow(projectId)}>Save</Button>
    </aside>
  )
}
