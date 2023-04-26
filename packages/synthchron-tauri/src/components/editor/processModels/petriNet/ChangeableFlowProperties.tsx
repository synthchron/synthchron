import { useCallback } from 'react'
import { EditorState, useEditorStore } from '../../editorStore/flowStore'
import shallow from 'zustand/shallow'

export const FlowFieldsToDisplay = {
  Place: ['store', 'accepting'],
  Transition: [],
}

export const fieldsToDisplay = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selector = useCallback(
    (state: EditorState) => ({
      selectedElement: state.selectedElement,
    }),
    []
  )

  const { selectedElement } = useEditorStore(selector, shallow)

  const displayData = selectedElement
    ? FlowFieldsToDisplay[
        selectedElement.data.label as keyof typeof FlowFieldsToDisplay
      ]
    : null
  const test2 = displayData
    ? Object.fromEntries(
        Object.entries(selectedElement?.data).filter(([key, value]) =>
          displayData.includes(key)
        )
      )
    : selectedElement?.data

  const betterVersion = Object.entries(selectedElement?.data).filter(
    ([key, value]) => selectedElement?.data.includes(key)
  )

  const test =
    FlowFieldsToDisplay[
      selectedElement?.data.label as keyof typeof FlowFieldsToDisplay
    ]

  return displayData
}
