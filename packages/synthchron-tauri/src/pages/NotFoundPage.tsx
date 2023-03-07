import { Box, Divider, Typography } from '@mui/material'

export const NotFoundPage = () => {
  return (
    <Box
      minHeight='100vh'
      alignContent={'center'}
      justifyContent={'center'}
      alignItems={'center'}
      display={'flex'}
      flexDirection={'column'}
    >
      <Divider style={{ width: '70%' }}>
        <Typography variant='h1'>404</Typography>
      </Divider>
      <Typography variant='h4'>Page not found</Typography>
    </Box>
  )
}
