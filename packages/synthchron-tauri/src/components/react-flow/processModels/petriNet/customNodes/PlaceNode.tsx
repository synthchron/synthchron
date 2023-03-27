import { Circle } from '@mui/icons-material'
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
  label: number | undefined
}

export const PlaceNodeShape: React.FC<PlaceNodeShapeProps> = (NodeProps) => {
  //There are a lot of +1's and +2's to account for strokewidth
  const { diameter, color } = config

  const styles = {
    fill: color,
    stroke: '#222',
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <svg
        style={{ overflow: 'visible' }}
        width={diameter * 2 + 2}
        height={diameter * 2 + 2}
      >
        <circle
          cx={diameter + 1}
          cy={diameter + 1}
          r={diameter}
          strokeWidth={NodeProps.strokeWidth ? NodeProps.strokeWidth : 1}
          {...styles}
        />
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

  const labelNumber = Number(data?.store)

  let labelElement

  if (labelNumber < 5 && labelNumber > 0) {
    labelElement = Array.from({ length: labelNumber }, (_, index) => (
      <Circle key={index} sx={{ fontSize: 10, padding: '1px' }} />
    ))
  } else {
    labelElement = data?.store
  }

  return (
    <div style={{ position: 'relative', height: diameter * 2 + 2 }}>
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
      <PlaceNodeShape strokeWidth={selected ? 2 : 1} label={labelElement} />
    </div>
  )
}

export default PlaceNode
