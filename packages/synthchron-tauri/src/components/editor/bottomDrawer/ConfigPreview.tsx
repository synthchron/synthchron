import React, { useState } from 'react'

import { Button, Paper, Typography } from '@mui/material'

import { Configuration } from '@synthchron/types'

interface ConfigPreviewProps {
  config: Configuration
}

export const ConfigPreview: React.FC<ConfigPreviewProps> = ({ config }) => {
  const [showJsonView, setShowJsonView] = useState(false)

  const handleToggleJsonView = () => {
    setShowJsonView(!showJsonView)
  }

  return (
    <Paper style={{ padding: '16px' }}>
      <Typography variant='h6' color='grey' gutterBottom>
        Configuration Preview
      </Typography>
      <Button
        variant='contained'
        color='primary'
        onClick={handleToggleJsonView}
      >
        {showJsonView ? 'Hide' : 'Show'}
      </Button>
      {showJsonView && (
        <pre style={{ marginTop: '16px', whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(config, null, 2)}
        </pre>
      )}
    </Paper>
  )
}
