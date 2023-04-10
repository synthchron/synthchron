import { Typography } from '@mui/material'
import { Container } from '@mui/system'
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
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: '10px',
      }}
    >
      <Typography
        variant='h6'
        style={{
          marginBottom: '1em',
        }}
      >
        Node Creator
      </Typography>

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
          {NodeShapeMap(key)}
        </div>
      ))}
    </Container>
  )
}
