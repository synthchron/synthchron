import { useCallback, useRef, useState } from 'react'
import { ReactFlowProvider, ReactFlowInstance } from 'reactflow'

// 👇 you need to import the reactflow styles
import 'reactflow/dist/style.css'

// 👇 Importing components
import { LeftSidebar } from './LeftSidebar'
import { StateFlow } from './StateFlow'
import { RFState, useFlowStore } from './ydoc/flowStore'
import { shallow } from 'zustand/shallow'
import { PropertiesWindow } from './RightSidebar'
import { Box } from '@mui/material'

// This component includes both the left and right sidebar, and handles the drag and drop functionality
export const SidebarsWrapper = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null)

  const onDragOver: React.DragEventHandler<HTMLDivElement> = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
    },
    []
  )

  const selector = useCallback(
    (state: RFState) => ({
      addNode: state.addNode,
    }),
    []
  )
  const { addNode } = useFlowStore(selector, shallow)

  const onDrop: React.DragEventHandler<HTMLDivElement> = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault()

    if (reactFlowWrapper.current == null || reactFlowInstance == null) return

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
    const type = event.dataTransfer.getData('application/reactflow')

    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    })
    const newNode = {
      id: '', // Will be overwritten by addNode
      type: type,
      position,
      data: {
        label: `${type == 'place' ? 'p' : 't'}`,
        store: 1,
        accepting: 'tokens >= 10',
      },
    }
    addNode(newNode)
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        width: '100%',
        flexGrow: 1,
      }}
    >
      <ReactFlowProvider>
        <LeftSidebar />
        <Box
          sx={{
            flexGrow: 1,
            height: '100%',
          }}
          ref={reactFlowWrapper}
        >
          <StateFlow
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
          />
        </Box>
        <PropertiesWindow />
      </ReactFlowProvider>
    </Box>
  )
}
