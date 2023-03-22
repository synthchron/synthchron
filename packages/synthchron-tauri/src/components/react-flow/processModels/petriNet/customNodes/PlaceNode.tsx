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
      cx={diameter / 2}
      cy={diameter / 2}
      r={diameter}
      strokeWidth={NodeProps.strokeWidth ? NodeProps.strokeWidth : 1}
      {...styles}
    />
  )

  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
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
      <PlaceNodeShape strokeWidth={selected ? 2 : 1} label={data?.store} />
    </div>
  )
}

export default PlaceNode
