import { Handle, NodeProps, Position } from 'reactflow'

import './NodeStyle.css'

export const TransitionNode: React.FC<NodeProps> = ({
  data,
  selected,
  isConnectable,
}) => {
  const width = 10
  const height = 200
  const color = '#eee'

  /* const shape = useShape({
    type: data?.shape,
    width,
    height,
    color: data?.color,
    selected,
  }) */
  const styles = {
    fill: color,
    strokeWidth: selected ? 2 : 1,
    stroke: '#222',
  }

  const shape = (
    <rect x={0} y={0} rx={0} width={width} height={height} {...styles} />
  )

  return (
    <div style={{ position: 'relative' }}>
      <Handle
        id='right'
        position={Position.Right}
        type='source'
        isConnectable={isConnectable}
      />
      <Handle
        id='left'
        position={Position.Left}
        type='source'
        isConnectable={isConnectable}
      />
      <svg
        style={{ display: 'block', overflow: 'visible' }}
        width={width}
        height={height}
      >
        {shape}
      </svg>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: -height / 2 - 10,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <div
          style={{
            fontFamily: 'monospace',
            fontWeight: 'bold',
            color: '#222',
            fontSize: 12,
          }}
        >
          {data?.label}
        </div>
      </div>
    </div>
  )
}

export default TransitionNode
