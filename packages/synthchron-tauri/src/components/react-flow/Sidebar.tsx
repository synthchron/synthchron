import { Avatar, Button, Chip } from '@mui/material'
import { useCallback } from 'react'
import { useParams } from 'react-router'
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
      awareness: state.awareness,
      collaboratorStates: state.collaboratorStates,
      awarenessState: state.awarenessState,
      saveFlow: state.saveFlow,
    }),
    []
  )

  const {
    nodeTypes,
    connectRoom,
    yWebRTCProvider,
    awareness,
    collaboratorStates,
    awarenessState,
    saveFlow,
  } = useFlowStore(selector, shallow)

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
      <Button onClick={() => connectRoom('myroom', true)}>
        {yWebRTCProvider !== null ? 'Reconnect (keep)' : 'Connect (keep)'}
      </Button>
      <Button onClick={() => connectRoom('myroom', false)}>
        {yWebRTCProvider !== null ? 'Reconnect (throw)' : 'Connect (throw)'}
      </Button>
      {awareness && collaboratorStates && awarenessState && (
        <>
          <br />
          You:
          <Chip
            avatar={<Avatar>{awarenessState.user.name.charAt(0)}</Avatar>}
            color='primary'
            style={{ backgroundColor: awarenessState.user.color }}
            label={awarenessState.user.name}
          />
          <br /> <br />
          Peers:
          {Object.entries(Object.fromEntries(collaboratorStates)).map(
            ([key, value]) => (
              <Chip
                key={key}
                avatar={<Avatar>{value.user.name.charAt(0)}</Avatar>}
                color='primary'
                style={{ backgroundColor: value.user.color }}
                label={value.user.name}
              />
            )
          )}
        </>
      )}
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
    </aside>
  )
}
