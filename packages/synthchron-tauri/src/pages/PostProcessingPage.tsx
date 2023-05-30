import { useState } from 'react'

import { Box, TextField, Typography } from '@mui/material'

import { PostprocessingConfiguration } from '@synthchron/types'

import { CustomAppBar } from '../components/CustomAppBar'
import PostprocessingPanel from '../components/editor/bottomDrawer/postprocessingPanel/PostprocessingPanel'

const defaultPostprocessing: PostprocessingConfiguration = {
  stepProbability: 0.1,
  postProcessingSteps: [],
}

export const PostProcessingPage = () => {
  const [postprocessing, setPostprocessing] = useState(defaultPostprocessing)
  return (
    <>
      <CustomAppBar />
      <Box sx={{ display: 'flex', height: '100%' }}>
        <Box sx={{ width: '45%', height: '100%' }}>
          <Typography variant='h6'>Paste your log here</Typography>
          <TextField multiline fullWidth rows={4} />
          <Typography variant='h6'>Or upload file</Typography>
          <input type='file' />
        </Box>
        <Box sx={{ width: '50%', height: '100%', marginLeft: 'auto' }}>
          <PostprocessingPanel
            postprocessing={postprocessing}
            setPostprocessing={setPostprocessing}
          />
        </Box>
      </Box>
    </>
  )
}
