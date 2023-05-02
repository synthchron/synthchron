import { useCallback, useState } from 'react'

import { faker } from '@faker-js/faker'
import {
  Avatar,
  Button,
  Chip,
  Container,
  TextField,
  Typography,
} from '@mui/material'
import { shallow } from 'zustand/shallow'

import { checkRoomIsEmpty } from '../../../utils/checkRoom'
import { EditorState, useEditorStore } from '../editorStore/flowStore'

export const CollaborationTab = () => {
  const selector = useCallback(
    (state: EditorState) => ({
      connectRoom: state.connectRoom,
      disconnectRoom: state.disconnectRoom,
      setRoomTextfieldState: state.setRoomTextfieldState,
      yWebRTCProvider: state.yWebRTCProvider,
      awareness: state.awareness,
      collaboratorStates: state.collaboratorStates,
      awarenessState: state.awarenessState,
      roomTextfieldState: state.roomTextfieldState,
    }),
    []
  )
  const [connectError, setConnectError] = useState<string>('')

  const {
    connectRoom,
    disconnectRoom,
    setRoomTextfieldState,
    roomTextfieldState,
    yWebRTCProvider,
    awareness,
    collaboratorStates,
    awarenessState,
  } = useEditorStore(selector, shallow)

  async function OpenRoom(KeepCurrent: boolean) {
    !roomTextfieldState.roomCode
      ? setRoomTextfieldState(faker.random.alpha(5), true)
      : setRoomTextfieldState(undefined, true)

    const isEmpty = await checkRoomIsEmpty(roomTextfieldState.roomCode)
    if (isEmpty) {
      setTimeout(() => {
        connectRoom(roomTextfieldState.roomCode, KeepCurrent)
      }, 500)
    } else {
      setConnectError('Room already exists')
      setRoomTextfieldState(undefined, false)
    }
  }
  function CloseRoom() {
    disconnectRoom()
    setRoomTextfieldState(undefined, false)
  }

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: '10px',
      }}
    >
      <Typography variant='h6'>Collaboration</Typography>
      <TextField
        variant='standard'
        label='Room Code'
        sx={{
          alignSelf: 'center',
        }}
        inputProps={{
          style: {
            textAlign: 'center',
          },
        }}
        disabled={roomTextfieldState.textAvailable}
        value={roomTextfieldState.roomCode}
        onChange={(event) =>
          setRoomTextfieldState(event.target.value, undefined)
        }
        error={connectError !== ''}
        helperText={connectError}
      />
      <Button onClick={() => OpenRoom(true)}>
        {yWebRTCProvider !== null ? 'Reconnect' : 'Open room for collaboration'}
      </Button>
      {yWebRTCProvider !== null && (
        <Button onClick={CloseRoom}>Leave Collaboration</Button>
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
    </Container>
  )
}
