import { Button } from '@mui/material'
import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { transformFlowToSimulator } from '../flowTransformer'
import { RFState, useFlowStore } from './ydoc/flowStore'
import './sidebar.css'

export const Sidebar = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }
  const transformTest = () => {
    console.log(transformFlowToSimulator(useFlowStore.getState()))
  }
  const selector = useCallback(
    (state: RFState) => ({
      nodeTypes: state.processModelFlowConfig.nodeTypes,
      connectRoom: state.connectRoom,
      disconnectRoom: state.disconnectRoom,
      yWebRTCProvider: state.yWebRTCProvider,
    }),
    []
  )

  const { nodeTypes, connectRoom, yWebRTCProvider } = useFlowStore(
    selector,
    shallow
  )

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
      <Button onClick={() => connectRoom('myroom', true)}> Connect </Button>
      Is connected : {yWebRTCProvider !== null ? 'true' : 'false'}
    </aside>
  )
}
