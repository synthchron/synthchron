import React from 'react'
import { Handle, NodeProps, Position } from 'reactflow'

//import styles from './Nodes.module.scss'

const config = {
  diameter: 30,
  color: '#eee',
}

const handleStyle = {
  width: '8px',
  height: '8px',
  backgroundColor: '#bbb',
}

export const PlaceNode: React.FC<NodeProps> = ({
  data,
  selected,
  isConnectable,
}) => {
  const { diameter, color } = config

  const styles = {
    fill: color,
    strokeWidth: selected ? 2 : 1,
    stroke: '#222',
  }

  const shape = (
    <circle cx={diameter / 2} cy={diameter / 2} r={diameter} {...styles} />
  )

  return (
    <div style={{ position: 'relative' }}>
      <Handle
        id='bottom'
        position={Position.Bottom}
        type='source'
        isConnectable={isConnectable}
        style={{
          ...handleStyle,
          bottom: '-30px',
        }}
      />
      <Handle
        id='top'
        position={Position.Top}
        type='source'
        isConnectable={isConnectable}
        style={{
          ...handleStyle,
          top: '-30px',
        }}
      />
      <Handle
        id='right'
        position={Position.Right}
        type='source'
        isConnectable={isConnectable}
        style={{
          ...handleStyle,
          right: '-30px',
        }}
      />
      <Handle
        id='left'
        position={Position.Left}
        type='source'
        isConnectable={isConnectable}
        style={{
          ...handleStyle,
          left: '-30px',
        }}
      />
      <svg
        style={{ display: 'block', overflow: 'visible' }}
        width={diameter}
        height={diameter}
      >
        {shape}
      </svg>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: 0,
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
          {data?.store}
        </div>
      </div>
    </div>
  )
}

export default PlaceNode
