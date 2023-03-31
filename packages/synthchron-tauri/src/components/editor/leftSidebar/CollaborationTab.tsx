import { Avatar, Box, Button, Chip, Container, Typography } from '@mui/material'
import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { EditorState, useEditorStore } from '../editorStore/flowStore'

export const CollaborationTab = () => {
  const selector = useCallback(
    (state: EditorState) => ({
      connectRoom: state.connectRoom,
      disconnectRoom: state.disconnectRoom,
      yWebRTCProvider: state.yWebRTCProvider,
      awareness: state.awareness,
      collaboratorStates: state.collaboratorStates,
      awarenessState: state.awarenessState,
    }),
    []
  )

  const {
    connectRoom,
    disconnectRoom,
    yWebRTCProvider,
    awareness,
    collaboratorStates,
    awarenessState,
  } = useEditorStore(selector, shallow)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: '10px',
      }}
    >
      <Typography variant='h6'>Collaboration</Typography>
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
        <Container>
          <br />
          You:
          {awarenessState?.user?.name && (
            <Chip
              avatar={<Avatar>{awarenessState.user.name.charAt(0)}</Avatar>}
              color='primary'
              style={{ backgroundColor: awarenessState.user.color }}
              label={awarenessState.user.name}
            />
          )}
          <br /> <br />
          Peers:
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
        </Container>
      )}
    </Box>
  )
}
