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

interface PlaceNodeShapeProps {
  strokeWidth: string | number | undefined
  label: string | number | undefined
}

export const PlaceNodeShape: React.FC<PlaceNodeShapeProps> = (NodeProps) => {
  const { diameter, color } = config

  const styles = {
    fill: color,
    stroke: '#222',
  }

  const shape = (
    <circle
      cx={diameter}
      cy={diameter}
      r={diameter}
      strokeWidth={NodeProps.strokeWidth ? NodeProps.strokeWidth : 1}
      {...styles}
    />
  )

  return (
    <div
      style={{
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <svg //+2 for storkewidth of 1.
        style={{ overflow: 'visible' }}
        width={diameter * 2 + 2}
        height={diameter * 2 + 2}
      >
        {shape}
      </svg>
      <div
        style={{
          textAlign: 'center',
          position: 'absolute',
          color: '#222',
        }}
      >
        {NodeProps?.label}
      </div>
    </div>
  )
}

export const PlaceNode: React.FC<NodeProps> = ({
  data,
  selected,
  isConnectable,
}) => {
  const { diameter } = config

  return (
    <div style={{ position: 'relative' }}>
      <Handle
        id='bottom'
        position={Position.Bottom}
        type='source'
        isConnectable={isConnectable}
        style={{
          ...handleStyle,
          bottom: -diameter / 2,
        }}
      />
      <Handle
        id='top'
        position={Position.Top}
        type='source'
        isConnectable={isConnectable}
        style={{
          ...handleStyle,
          top: -diameter / 2,
        }}
      />
      <Handle
        id='right'
        position={Position.Right}
        type='source'
        isConnectable={isConnectable}
        style={{
          ...handleStyle,
          right: -diameter / 2,
        }}
      />
      <Handle
        id='left'
        position={Position.Left}
        type='source'
        isConnectable={isConnectable}
        style={{
          ...handleStyle,
          left: -diameter / 2,
        }}
      />
      <PlaceNodeShape strokeWidth={selected ? 2 : 1} label={data?.store} />
    </div>
  )
}

export default PlaceNode
