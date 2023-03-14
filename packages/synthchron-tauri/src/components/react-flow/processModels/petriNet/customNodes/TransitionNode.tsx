import { Handle, NodeProps, Position } from 'reactflow'

// import './NodeStyle.css'

const config = {
  width: 5,
  height: 100,
  color: '#eee',
}

const handleStyle = {
  width: '8px',
  height: '8px',
  backgroundColor: '#bbb',
}

export const TransitionNode: React.FC<NodeProps> = ({
  data,
  selected,
  isConnectable,
}) => {
  const { width, height, color } = config

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
        style={{
          ...handleStyle,
          right: '-15px',
        }}
      />
      <Handle
        id='left'
        position={Position.Left}
        type='source'
        isConnectable={isConnectable}
        style={{
          ...handleStyle,
          left: '-15px',
        }}
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
          pointerEvents: 'none',
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
