import { Box, Divider, Grid, Paper, Stack, Typography } from '@mui/material'

import { useEditorStore } from '../editorStore/flowStore'
import { NodeShapeMap } from '../processModels/petriNet/NodeShapeMap'

export const CreatorTab: React.FC = () => {
  const nodeTypes = useEditorStore(
    (state) => state.processModelFlowConfig.nodeTypes
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragStart = (event: any, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Paper
        sx={{
          padding: '16px',
          paddingBottom: '0px',
        }}
      >
        <Stack>
          <Typography variant='h6' gutterBottom>
            Node Creator
          </Typography>

          <Divider />

          <Grid
            container
            sx={{
              marginTop: '0.5em',
            }}
          >
            {Object.keys(nodeTypes).map((key) => (
              <div
                key={key}
                onDragStart={(event) => onDragStart(event, key)}
                draggable
                style={{
                  alignSelf: 'center',
                  transform: 'translate(0, 0)',
                  padding: '10px',
                }}
              >
                <Grid item>{NodeShapeMap(key)}</Grid>
              </div>
            ))}
          </Grid>
        </Stack>
      </Paper>
    </Box>
  )
}
