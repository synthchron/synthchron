import { Button } from '@mui/material'
import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { TransformFlowToSimulator } from '../FlowTransformer'
import useStore, { RFState } from './flowStore'
import './sidebar.css'

export const Sidebar = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }
  const transformTest = () => {
    console.log(TransformFlowToSimulator(useStore.getState()))
  }
  const selector = useCallback(
    (state: RFState) => ({
      nodeTypes: state.processModelFlowConfig.nodeTypes,
    }),
    []
  )

  const { nodeTypes } = useStore(selector, shallow)

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
    </aside>
  )
}
