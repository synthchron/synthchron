import React from 'react'
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

interface TransitionNodeShapeProps {
  strokeWidth: string | number | undefined
  label: string | undefined
}

export const TransitionNodeShape: React.FC<TransitionNodeShapeProps> = (
  NodeProps
) => {
  const { width, height, color } = config

  const shape = (
    <rect
      x={0}
      y={0}
      rx={0}
      width={width}
      height={height}
      strokeWidth={NodeProps.strokeWidth ? NodeProps.strokeWidth : 1}
    />
  )

  const styles = {
    fill: color,
    stroke: '#222',
  }

  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <svg
        style={{ overflow: 'visible' }}
        width={width}
        height={height}
        {...styles}
      >
        {shape}
      </svg>
      <div
        style={{
          textAlign: 'center',
          position: 'absolute',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          color: '#222',
          fontSize: 12,
        }}
      >
        {NodeProps.label}
      </div>
    </div>
  )
}

export const TransitionNode: React.FC<NodeProps> = ({
  data,
  selected,
  isConnectable,
}) => {
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
      <TransitionNodeShape strokeWidth={selected ? 2 : 1} label={data?.label} />
    </div>
  )
}

export default TransitionNode
