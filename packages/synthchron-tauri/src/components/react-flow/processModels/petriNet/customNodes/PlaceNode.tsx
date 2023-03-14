import { Handle, NodeProps, Position } from 'reactflow'

//import styles from './Nodes.module.scss'

const config = {
  diameter: 50,
  color: '#eee',
}

const handleStyle = {
  width: '8px',
  height: '8px',
  backgroundColor: '#bbb',
}

export const PlaceNode: React.FC<NodeProps> = ({ data, isConnectable }) => {
  return (
    <div
      style={{
        fontSize: '12px',
        background: '#eee',
        border: '1px solid #000000',
        borderRadius: '50px',
        textAlign: 'center',
        color: 'red',
        minWidth: config.diameter,
        minHeight: config.diameter,
      }}
    >
      <div className='handleContainer'>
        <Handle
          type='source'
          position={Position.Top}
          id='top'
          isConnectable={isConnectable}
          style={{
            ...handleStyle,
            top: '-15px',
          }}
        />
        <Handle
          type='source'
          position={Position.Bottom}
          id='bottom'
          isConnectable={isConnectable}
          style={{
            ...handleStyle,
            bottom: '-15px',
          }}
        />
        <Handle
          type='source'
          position={Position.Right}
          id='right'
          isConnectable={isConnectable}
          style={{
            ...handleStyle,
            right: '-15px',
          }}
        />
        <Handle
          type='source'
          position={Position.Left}
          id='left'
          isConnectable={isConnectable}
          style={{
            ...handleStyle,
            left: '-15px',
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: -config.diameter / 2 - 25,
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

export default PlaceNode
