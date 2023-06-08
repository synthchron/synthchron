import React from 'react'
import { useCallback, useRef, useState } from 'react'

import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import { Box, Fab, Typography } from '@mui/material'
import { Allotment, AllotmentHandle, LayoutPriority } from 'allotment'
import { ReactFlowInstance } from 'reactflow'
import { shallow } from 'zustand/shallow'

import { CopyPaste } from '../common/CopyPaste'
// 👇 Importing components
import { LeftSidebar } from './LeftSidebar'
import { RightSidebar } from './RightSidebar'
import { StateFlow } from './StateFlow'
import { BottomDrawer } from './bottomDrawer/BottomDrawer'
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
        label: `${type == 'Transition' ? 'T' : 'P'}`,
        ...(type === 'Transition' ? { weight: 1 } : { tokens: 1 }),
      },
    }
    addNode(newNode)
  }
  const sidebarMinSize = 30
  const leftSidebarMaxSize = 300
  const rightSidebarMaxSize = 400
  const [leftSidebarPreferredSize, setLeftSidebarPreferredSize] =
    useState(leftSidebarMaxSize)
  const [rightSidebarPreferredSize, setRightSidebarPreferredSize] =
    useState(rightSidebarMaxSize)
  const getResetSidebarSize = (
    currentSize: number,
    maxSize: number,
    minSize: number
  ) => {
    if (currentSize === minSize) {
      return maxSize
    }
    return minSize
  }
  const ref = useRef<AllotmentHandle>(null)

  const [bottomDrawerOpen, setBottomDrawerOpen] = useState(false)

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
      <Allotment
        ref={ref}
        proportionalLayout={false}
        defaultSizes={[leftSidebarMaxSize, 1, rightSidebarMaxSize]}
        onChange={(sizes) => {
          const leftSidebarSize = sizes[0]
          const rightSidebarSize = sizes[2]
          const newLeftSidebarPreferredSize = getResetSidebarSize(
            leftSidebarSize,
            leftSidebarMaxSize,
            sidebarMinSize
          )
          const newRightSidebarPreferredSize = getResetSidebarSize(
            rightSidebarSize,
            rightSidebarMaxSize,
            sidebarMinSize
          )
          setLeftSidebarPreferredSize(newLeftSidebarPreferredSize)
          setRightSidebarPreferredSize(newRightSidebarPreferredSize)
        }}
      >
        <Allotment.Pane
          maxSize={leftSidebarMaxSize}
          preferredSize={leftSidebarPreferredSize}
          priority={LayoutPriority.Low}
        >
          <div
            style={{
              height: '100%',
              filter:
                leftSidebarPreferredSize === leftSidebarMaxSize
                  ? 'brightness(0.7) blur(5px)'
                  : '',
              backgroundColor: 'white',
              transitionDuration: '0.25s',
              overflow: 'auto',
              scrollbarWidth: 'thin',
            }}
          >
            <LeftSidebar />
          </div>
        </Allotment.Pane>

        <Allotment.Pane priority={LayoutPriority.High}>
          <Box
            sx={{
              flexGrow: 1,
              height: '100%',
            }}
            ref={reactFlowWrapper}
          >
            <CopyPaste />
            <StateFlow
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
            />
          </Box>
          {/* Render the FAB */}
          {
            <Fab
              size='small'
              aria-label='add'
              variant='extended'
              color='primary'
              sx={{
                ':hover': {
                  bgcolor: 'gray',
                },
                position: 'absolute',
                bottom: '8px',
                right: '50%',
              }}
              onClick={() => {
                setBottomDrawerOpen(true)
              }}
            >
              <DoubleArrowIcon />
              <Typography>Simulate</Typography>
            </Fab>
          }
        </Allotment.Pane>
        <Allotment.Pane
          maxSize={rightSidebarMaxSize}
          preferredSize={rightSidebarPreferredSize}
          priority={LayoutPriority.Low}
        >
          <div
            style={{
              height: '100%',
              filter:
                rightSidebarPreferredSize === rightSidebarMaxSize
                  ? 'brightness(0.7) blur(5px)'
                  : '',
              backgroundColor: 'white',
              transitionDuration: '0.25s',
              overflow: 'auto',
            }}
          >
            <RightSidebar />
          </div>
        </Allotment.Pane>
      </Allotment>
      <BottomDrawer
        open={bottomDrawerOpen}
        onClose={() => {
          setBottomDrawerOpen(false)
        }}
      />
    </Box>
  )
}
