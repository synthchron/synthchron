import React from 'react'

import { Typography } from '@mui/material'
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
  id: string | undefined
}

export const PlaceNodeShape: React.FC<PlaceNodeShapeProps> = ({
  strokeWidth,
  id,
  label = 0,
}) => {
  // There are a lot of +1's and +2's to account for strokewidth
  const { diameter, color } = config

  const styles = {
    fill: color,
    stroke: '#222',
  }

  const tokenSize = diameter / 4 // size of a single token circle
  const maxTokens = 4 // maximum number of tokens to show
  const numTokens = typeof label === 'number' ? label : -1
  const tokenShapes = []
  if (numTokens <= maxTokens) {
    // create black circle shapes for each token
    const totalWidth = numTokens * tokenSize * 1.5
    // console.log(diameter, ' ', totalWidth, ' ', label)
    const startX = diameter + 5 - totalWidth / 2
    for (let i = 0; i < numTokens; i++) {
      tokenShapes.push(
        <circle
          key={`token-${i}`}
          cx={startX + i * (tokenSize + tokenSize / 2)}
          cy={diameter + 1}
          r={tokenSize / 2}
          fill='black'
        />
      )
    }
  }

  const labelElement =
    numTokens == -1 || numTokens > maxTokens ? (
      <div
        style={{
          textAlign: 'center',
          position: 'absolute',
          color: '#222',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {label}
      </div>
    ) : null

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
          strokeWidth={strokeWidth ?? 1}
          {...styles}
        />
        {tokenShapes}
      </svg>
      <div
        style={{
          textAlign: 'center',
          position: 'absolute',
          color: '#222',
          paddingTop: 16, // Eyed size of the subtitle line, to make the tokens centered.
        }}
      >
        {labelElement}
        <Typography fontSize={8} color={'#555'} marginTop={3} gutterBottom>
          p{id}
        </Typography>
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
      <PlaceNodeShape
        strokeWidth={selected ? 2 : 1}
        label={data?.tokens}
        id={id}
      />
    </div>
  )
}

export default PlaceNode
