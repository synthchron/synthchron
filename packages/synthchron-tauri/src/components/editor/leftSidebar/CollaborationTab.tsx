import { useCallback, useState } from 'react'

import { faker } from '@faker-js/faker'
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
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
  const [checking, setChecking] = useState<boolean>(false)

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

  async function openRoom(keepCurrent: boolean) {
    setChecking(true)

    const roomCode =
      roomTextfieldState.roomCode.trim() || faker.string.alpha(10)
    setRoomTextfieldState(roomCode, true)

    const isEmpty = await checkRoomIsEmpty(roomCode)
    if (isEmpty) {
      connectRoom(roomCode, keepCurrent)
      setConnectError('')
    } else {
      setConnectError('Room already exists')
      setRoomTextfieldState(undefined, false)
    }
    setChecking(false)
  }
  function CloseRoom() {
    disconnectRoom()
  }

  return (
    <Paper
      sx={{
        padding: '16px',
      }}
    >
      <Stack spacing={1}>
        <Typography variant='h6' gutterBottom>
          Collaboration
        </Typography>
        <TextField
          label='Room Code'
          size='small'
          disabled={roomTextfieldState.textAvailable}
          value={roomTextfieldState.roomCode}
          onChange={(event) =>
            setRoomTextfieldState(event.target.value, undefined)
          }
          error={connectError !== ''}
          helperText={connectError}
        />
        <Button onClick={() => openRoom(true)} disabled={checking} size='small'>
          {yWebRTCProvider !== null
            ? 'Reconnect'
            : 'Open room for collaboration'}
        </Button>

        {yWebRTCProvider !== null && (
          <>
            <Divider />
            {awareness && collaboratorStates && awarenessState && (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                {awarenessState?.user?.name && (
                  <Chip
                    avatar={
                      <Avatar>{awarenessState.user.name.charAt(0)}</Avatar>
                    }
                    color='primary'
                    style={{ backgroundColor: awarenessState.user.color }}
                    label={awarenessState.user.name + ' (You)'}
                  />
                )}
                {Object.entries(Object.fromEntries(collaboratorStates))
                  .filter(([_key, value]) => value?.user?.name)
                  .map(([key, value]) => (
                    <Chip
                      key={key}
                      avatar={<Avatar>{value.user.name.charAt(0)}</Avatar>}
                      color='primary'
                      style={{ backgroundColor: value.user.color }}
                      label={value.user.name}
                      sx={{
                        margin: '1px',
                        maxWidth: '100px',
                      }}
                    />
                  ))}
              </Box>
            )}
            <Divider />

            <Button onClick={CloseRoom} color='error' size='small'>
              Leave Collaboration
            </Button>
          </>
        )}
      </Stack>
    </Paper>
  )
}
