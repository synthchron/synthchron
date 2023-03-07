import { useCallback, useRef, useState } from 'react'
import { ReactFlowProvider, ReactFlowInstance } from 'reactflow'

// 👇 you need to import the reactflow styles
import 'reactflow/dist/style.css'

// 👇 Importing components
import { Sidebar } from './Sidebar'
import { StateFlow } from './StateFlow'
import useStore, { RFState } from './flowStore'
import { shallow } from 'zustand/shallow'

//Drag and drop setup
let id = 0
const dndGetId = () => `dndnode_${id++}`

export const DragAndDropWrapper = () => {
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
  const { addNode } = useStore(selector, shallow)

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
      id: dndGetId(),
      type: type,
      position,
      data: { label: `${type} node`, store: 0 },
    }
    addNode(newNode)
  }

  return (
    <div className='dndflow'>
      <ReactFlowProvider>
        <Sidebar />
        <div className='reactflow-wrapper' ref={reactFlowWrapper}>
          <StateFlow
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
          />
        </div>
      </ReactFlowProvider>
    </div>
  )
}
