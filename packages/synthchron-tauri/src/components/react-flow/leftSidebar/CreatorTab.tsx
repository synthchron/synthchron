import { Box, Typography } from '@mui/material'
import { NodeShapeMap } from '../processModels/NodeShapeMap'
import { useFlowStore } from '../ydoc/flowStore'

export const CreatorTab: React.FC = () => {
  const nodeTypes = useFlowStore(
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
        marginTop: '10px',
      }}
    >
      <Typography variant='h6'>Node Creator</Typography>
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
    </Box>
  )
}
