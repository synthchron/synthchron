import { Box, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CustomAppBar } from '../components/CustomAppBar'
import { checkRoomIsEmpty } from '../components/react-flow/ydoc/checkRoom'
import { useFlowStore } from '../components/react-flow/ydoc/flowStore'

export const CollaborationPage = () => {
  const [roomId, setRoomId] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [checking, setChecking] = useState<boolean>(false)

  const navigate = useNavigate()
  const connectRoom = useFlowStore((state) => state.connectRoom)

  return (
    <>
      <CustomAppBar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          height: '80vh',
          width: '100vw',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            marginTop: '30vh',
            display: 'flex',
            flexDirection: 'column',
            minWidth: '50vw',
          }}
        >
          <Typography
            sx={{
              alignSelf: 'center',
            }}
            variant='h3'
          >
            Collaboration
          </Typography>
          <Typography
            sx={{
              alignSelf: 'center',
            }}
            variant='h5'
          >
            Enter a collaboration id
          </Typography>
          <TextField
            variant='standard'
            autoFocus
            sx={{
              marginTop: '5vh',
              alignSelf: 'center',
              minWidth: '50vw',
            }}
            inputProps={{
              style: {
                textAlign: 'center',
              },
            }}
            onKeyDown={async (event) => {
              if (event.key === 'Enter') {
                const roomid = (event.target as HTMLTextAreaElement).value
                setChecking(true)
                const isEmpty = await checkRoomIsEmpty(roomid)
                setChecking(false)
                if (!isEmpty) {
                  // TODO: Redirect to editor
                  connectRoom(roomid, false)
                  navigate('/editor')
                } else {
                  setError('Room does not exist')
                }
                // TODO: check if collab exists, then redirect to editor
              }
            }}
            disabled={checking}
            value={checking ? 'Checking...' : roomId}
            onChange={(event) => {
              setRoomId(event.target.value)
              setError('')
            }}
            error={error !== ''}
            helperText={error}
          />
        </Box>
      </Box>
    </>
  )
}
