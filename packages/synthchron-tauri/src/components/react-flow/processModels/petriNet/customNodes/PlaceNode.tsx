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
  //There are a lot of +1's and +2's to account for strokewidth
  const { diameter, color } = config

  const styles = {
    fill: color,
    stroke: '#222',
  }

  const shape = (
    <circle
      cx={diameter + 1}
      cy={diameter + 1}
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
      <svg
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
  id,
  selected,
  isConnectable,
}) => {
  const { diameter } = config

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
      <PlaceNodeShape strokeWidth={selected ? 2 : 1} label={data?.store} />
      <div
        style={{
          //This does not center place names properly
          //But there is a task to display labels, which can do it
          position: 'absolute',
          textAlign: 'center',
          width: '100%',
        }}
      >
        p{id}
      </div>
    </div>
  )
}

export default PlaceNode
