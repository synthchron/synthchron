import { Box, Stack } from '@mui/material'

import { GeneralTab } from './GeneralTab'
import { PropertiesTab } from './PropertiesTab'

export const PropertiesAndGeneralTab = () => (
  <Box
    sx={{
      margin: '10px',
    }}
  >
    <Stack spacing={1}>
      <GeneralTab />
      <PropertiesTab />
    </Stack>
  </Box>
)
