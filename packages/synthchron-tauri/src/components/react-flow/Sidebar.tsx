import { Avatar, Button, Chip, Stack, Typography } from '@mui/material'
import { useCallback } from 'react'
import { useParams } from 'react-router'
import { shallow } from 'zustand/shallow'
import { petriNetEngine, PetriNetProcessModel } from '@synthchron/simulator'
import { transformFlowToSimulator } from '../flowTransformer'
import { RFState, useFlowStore } from './ydoc/flowStore'
import './sidebar.css'
import React from 'react'
import { NodeShapeMap } from './processModels/NodeShapeMap'
import { simulateWithEngine } from '@synthchron/simulator'

export const Sidebar = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }
  const transformTest = () => {
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
    disconnectRoom,
    yWebRTCProvider,
    awareness,
    collaboratorStates,
    awarenessState,
    saveFlow,
  } = useFlowStore(selector, shallow)

  const { projectId } = useParams<{ projectId: string }>()

  return (
    <aside>
      <Stack spacing={2}>
        <Typography color='text.primary'>
          You can drag these nodes to the pane on the right.
        </Typography>
        {Object.keys(nodeTypes).map((key) => (
          <div
            key={key}
            onDragStart={(event) => onDragStart(event, key)}
            draggable
            style={{ alignSelf: 'center', transform: 'translate(0, 0)' }}
          >
            {NodeShapeMap(key)}
          </div>
        ))}
        <Button onClick={transformTest}> Transform </Button>
        <Button onClick={() => connectRoom('myroom', true)}>
          {yWebRTCProvider !== null ? 'Reconnect (keep)' : 'Connect (keep)'}
        </Button>
        <Button onClick={() => connectRoom('myroom', false)}>
          {yWebRTCProvider !== null ? 'Reconnect (throw)' : 'Connect (throw)'}
        </Button>
        {yWebRTCProvider !== null && (
          <Button onClick={disconnectRoom}>Leave Collaboration</Button>
        )}
        {awareness && collaboratorStates && awarenessState && (
          <>
            <Typography color='text.primary'>You:</Typography>
            {awarenessState?.user?.name && (
              <Chip
                avatar={<Avatar>{awarenessState.user.name.charAt(0)}</Avatar>}
                color='primary'
                style={{ backgroundColor: awarenessState.user.color }}
                label={awarenessState.user.name}
              />
            )}
            <Typography color='text.primary'>Peers:</Typography>
            {Object.entries(Object.fromEntries(collaboratorStates))
              .filter(([_key, value]) => value?.user?.name)
              .map(([key, value]) => (
                <Chip
                  key={key}
                  avatar={<Avatar>{value.user.name.charAt(0)}</Avatar>}
                  color='primary'
                  style={{ backgroundColor: value.user.color }}
                  label={value.user.name}
                />
              ))}
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
        <Button onClick={simulate}>Simulate</Button>
      </Stack>
    </aside>
  )
}
