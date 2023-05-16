import React from 'react'
import { useCallback, useRef, useState } from 'react'

import { Box, Button } from '@mui/material'
import { Allotment } from 'allotment'
import { ReactFlowInstance, ReactFlowProvider } from 'reactflow'
import { shallow } from 'zustand/shallow'

// 👇 Importing components
import { LeftSidebar } from './LeftSidebar'
import { RightSidebar } from './RightSidebar'
import { StateFlow } from './StateFlow'
import { EditorState, useEditorStore } from './editorStore/flowStore'

import 'allotment/dist/style.css'
// 👇 you need to import the reactflow styles
import 'reactflow/dist/style.css'

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
    (state: EditorState) => ({
      addNode: state.addNode,
    }),
    []
  )
  const { addNode } = useEditorStore(selector, shallow)

  const onDrop: React.DragEventHandler<HTMLDivElement> = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault()

    if (reactFlowWrapper.current == null || reactFlowInstance == null) return

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
    const type = event.dataTransfer.getData('application/reactflow')
    if (type == '') return

    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    })
    const newNode = {
      id: '', // Will be overwritten by addNode
      type: type,
      position,
      data: {
        label: `${type == 'Transition' ? 'Transition' : 'Place'}`,
        ...(type === 'Transition' ? { weight: 1 } : { tokens: 1 }),
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
        <Allotment>
          <Allotment.Pane>
          <LeftSidebar />
          </Allotment.Pane>

          <Allotment.Pane>
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
          </Allotment.Pane>
          <Allotment.Pane>
          <RightSidebar />
          </Allotment.Pane>
        </Allotment>
    </Box>
  )
}
