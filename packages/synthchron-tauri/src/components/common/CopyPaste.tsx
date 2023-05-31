import { useEffect, useRef, useState } from 'react'

import { useHotkeys } from 'react-hotkeys-hook'
import { Node, useReactFlow } from 'reactflow'

import { useEditorStore } from '../editor/editorStore/flowStore'

export const CopyPaste = () => {
  const selectedElement = useEditorStore((state) => state.selectedElement)

  const addNode = useEditorStore((state) => state.addNode)

  const [copyElement, setCopyElement] = useState<Node | undefined>(undefined)
  const mousePosition = useRef({ x: 0, y: 0 })

  const reactFlow = useReactFlow()
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current = { x: event.clientX, y: event.clientY }
    }

    window.addEventListener('pointermove', handleMouseMove)

    return () => {
      window.removeEventListener('pointermove', handleMouseMove)
    }
  }, [])

  // ############# Hotkeys #############
  useHotkeys(
    'ctrl+c',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => {
      event.preventDefault()
      if (
        selectedElement !== undefined &&
        (selectedElement.type === 'Place' ||
          selectedElement.type === 'Transition')
      ) {
        setCopyElement(selectedElement as Node)
      }
    },
    [selectedElement, addNode]
  )

  useHotkeys(
    'ctrl+v',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => {
      event.preventDefault()
      if (copyElement !== undefined) {
        const viewport = reactFlow.getViewport()
        addNode({
          ...copyElement,
          position: {
            x:
              (mousePosition.current.x -
                viewport.x -
                (divRef.current?.getClientRects()[0].x || 0)) /
              viewport.zoom,
            y:
              (mousePosition.current.y -
                viewport.y -
                (divRef.current?.getClientRects()[0].y || 0)) /
              viewport.zoom,
          },
          data: {
            ...copyElement.data,
            label: `${copyElement.data.label} (copy)`,
          },
        })
      }
    },
    [copyElement, addNode]
  )

  return <div ref={divRef} />
}
