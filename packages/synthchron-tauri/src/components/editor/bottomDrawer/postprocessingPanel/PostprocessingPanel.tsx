import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import AddIcon from '@mui/icons-material/Add'
import HelpIcon from '@mui/icons-material/Help'
// Temporary
import { IconButton, Paper, Tooltip, Typography } from '@mui/material'

import {
  PostprocessingConfiguration,
  PostprocessingStepType,
} from '@synthchron/postprocessor'

import { SortableItem } from './SortableItem'

const postprocessingText = `Apply postprocessing steps to the generated traces to add noise. 
The weight chooses which postprocessing step should be applied. 
Currently, only one type of noise can be applied to each event.`

interface PostprocessingPanelProps {
  // Define props here
  postprocessing: PostprocessingConfiguration
  setPostprocessing: (
    f: (p: PostprocessingConfiguration) => PostprocessingConfiguration
  ) => void
}

const PostprocessingPanel: React.FC<PostprocessingPanelProps> = ({
  postprocessing,
  setPostprocessing,
}) => {
  const [order, setOrder] = useState<number[]>([])

  useEffect(() => {
    if (order.length > postprocessing.postProcessingSteps.length) return
    setOrder([
      ...order, // Add new elements
      ...Array.from(
        { length: postprocessing.postProcessingSteps.length - order.length },
        (_, i) => 1 + i + order.length
      ), // Fill with new elements
    ])
  }, [postprocessing])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  return (
    <Paper sx={{ padding: '16px' }}>
      <Typography variant='h6' gutterBottom>
        Postprocessing
        <Tooltip title={postprocessingText} placement='right'>
          <IconButton>
            <HelpIcon fontSize='small' />
          </IconButton>
        </Tooltip>
      </Typography>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={order.slice(0, postprocessing.postProcessingSteps.length)}
          strategy={verticalListSortingStrategy}
        >
          {postprocessing.postProcessingSteps.map((step, index) => (
            <SortableItem
              key={order[index]}
              id={order[index]}
              step={step}
              setStep={(step) => {
                if (step === undefined) {
                  setPostprocessing(
                    (postprocessing: PostprocessingConfiguration) => {
                      const newPostprocessing: PostprocessingConfiguration = {
                        postProcessingSteps: [
                          ...postprocessing.postProcessingSteps.slice(0, index),
                          ...postprocessing.postProcessingSteps.slice(
                            index + 1
                          ),
                        ],
                        stepProbability: postprocessing.stepProbability,
                      }

                      return newPostprocessing
                    }
                  )
                  setOrder((order) => [
                    ...order.slice(0, index),
                    ...order.slice(index + 1),
                    order[index],
                  ])
                  return
                }
                setPostprocessing(
                  (postprocessing: PostprocessingConfiguration) => {
                    const newPostprocessing: PostprocessingConfiguration = {
                      postProcessingSteps: [
                        ...postprocessing.postProcessingSteps.slice(0, index),
                        step,
                        ...postprocessing.postProcessingSteps.slice(index + 1),
                      ],
                      stepProbability: postprocessing.stepProbability,
                    }

                    return newPostprocessing
                  }
                )
              }}
            />
          ))}
        </SortableContext>
      </DndContext>
      <Tooltip title='Add new postprocessing step'>
        <Paper
          style={{
            backgroundColor: 'lightgrey',
            width: '100%',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            cursor: 'pointer',
            height: '2rem',
          }}
          onClick={() => {
            setPostprocessing((postprocessing: PostprocessingConfiguration) => {
              const newPostprocessing: PostprocessingConfiguration = {
                postProcessingSteps: [
                  ...postprocessing.postProcessingSteps,
                  {
                    type:
                      Math.random() < 0.33
                        ? PostprocessingStepType.DeletionStep
                        : Math.random() < 0.5
                        ? PostprocessingStepType.InsertionStep
                        : PostprocessingStepType.SwapStep,
                    weight: 1,
                  },
                ],
                stepProbability: postprocessing.stepProbability,
              }

              return newPostprocessing
            })
          }}
        >
          <AddIcon />
        </Paper>
      </Tooltip>
    </Paper>
  )

  function handleDragEnd(event: any) {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = order.indexOf(active.id)
      const newIndex = order.indexOf(over.id)

      setPostprocessing((postprocessing: PostprocessingConfiguration) => ({
        postProcessingSteps: arrayMove(
          postprocessing.postProcessingSteps,
          oldIndex,
          newIndex
        ),
        stepProbability: postprocessing.stepProbability,
      }))
      setOrder((order) => arrayMove(order, oldIndex, newIndex))
    }
  }
}

export default PostprocessingPanel
