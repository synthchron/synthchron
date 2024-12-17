import React from 'react'

import { Typography } from '@mui/material'
import { Handle, NodeProps, Position } from 'reactflow'

import { PetriNetTransitionData } from '../petriNetTypes'
import { useEditorStore } from '../../editorStore/flowStore'

const config = {
  size: 60,
  color: '#eee',
}

const handleStyle = {
  width: '8px',
  height: '8px',
  backgroundColor: '#bbb',
}

interface TransitionNodeShapeProps {
  strokeWidth?: string | number
  label?: string
  data?: PetriNetTransitionData
}

export const TransitionNodeShape: React.FC<TransitionNodeShapeProps> = ({
  strokeWidth,
  label,
  data,
}) => {
  const { size, color } = config
  const displayFullTransitionName = useEditorStore((state) => state.displayFullTransitionName)

  const shape = (
    <rect
      x={0}
      y={0}
      rx={4}
      width={size}
      height={size}
      strokeWidth={strokeWidth || 1}
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
        width={size}
        height={size}
        {...styles}
      >
        {shape}
      </svg>
      <div
        style={{
          position: 'absolute',
          maxWidth: size,
          maxHeight: size,
        }}
      >
        <Typography fontSize={10} noWrap={!displayFullTransitionName} padding={0.4}>
          {label}
        </Typography>
      </div>
      <div
        style={{
          position: 'absolute',
          maxWidth: size,
          maxHeight: size,
          transform: 'translate(0, -1em)',
          color: '#222',
        }}
      >
        <Typography fontSize={8} noWrap padding={0.4}>
          {data?.weight}
        </Typography>
      </div>
    </div>
  )
}

export const TransitionNode: React.FC<NodeProps<PetriNetTransitionData>> = ({
  data,
  selected,
  isConnectable,
}) => {
  const displayFullTransitionName = useEditorStore((state) => state.displayFullTransitionName)

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
      <TransitionNodeShape
        strokeWidth={selected ? 2 : 1}
        label={data?.label}
        data={data}
      />
      {displayFullTransitionName && (
        <div
          style={{
            position: 'absolute',
            top: '-1.5em',
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          <Typography fontSize={10} noWrap>
            {data?.label}
          </Typography>
        </div>
      )}
    </div>
  )
}

export default TransitionNode
