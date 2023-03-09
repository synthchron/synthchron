import { Handle, NodeProps, Position } from 'reactflow'

import './NodeStyle.css'

const config = {
  diameter: 50,
  color: '#eee',
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
        />
        <Handle
          type='source'
          position={Position.Bottom}
          id='bottom'
          isConnectable={isConnectable}
        />
        <Handle
          type='source'
          position={Position.Right}
          id='right'
          isConnectable={isConnectable}
        />
        <Handle
          type='source'
          position={Position.Left}
          id='left'
          isConnectable={isConnectable}
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
