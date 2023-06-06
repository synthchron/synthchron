import React, { useCallback, useEffect, useState } from 'react'

import {
  DndContext,
  DragEndEvent,
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
import { IconButton, Paper, Slider, Tooltip, Typography } from '@mui/material'
import { debounce } from 'lodash'

import {
  PostprocessingConfiguration,
  PostprocessingStepType,
} from '@synthchron/types'

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
  // Note: This is a temporary implementation. There is a
  // bug that adding more than 10 post processing steps will cause a warning.
  const [order, setOrder] = useState<number[]>([])
  const [sliderValue, setSliderValue] = useState(postprocessing.stepProbability)

  // Temporary
  useEffect(() => {
    console.log('Postprocessing changed', postprocessing)
  }, [postprocessing])

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

  const sliderDebouncedChange = useCallback(
    debounce((value) => {
      setPostprocessing((postprocessing: PostprocessingConfiguration) => ({
        ...postprocessing,
        stepProbability: value as number,
        postProcessingSteps: postprocessing.postProcessingSteps,
      }))
    }, 75),
    [setPostprocessing]
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
      <Typography variant='body2' gutterBottom>
        Noise probability
      </Typography>
      <Slider
        value={sliderValue}
        onChange={(event, value) => {
          setSliderValue(value as number)
          sliderDebouncedChange(value)
          // setLocalPostprocessing(
          //   (postprocessing: PostprocessingConfiguration) => ({
          //     stepProbability: value as number,
          //     postProcessingSteps: postprocessing.postProcessingSteps,
          //   })
          // )
        }}
        valueLabelDisplay='auto'
        step={0.01}
        min={0}
        max={1}
        marks={[
          { value: 0, label: '0' },
          { value: 1, label: '1' },
        ]}
      />
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
            <div key={order[index]}>
              {order[index] !== undefined && (
                <SortableItem
                  id={order[index]}
                  step={step}
                  setStep={(step) => {
                    // If step is undefined, delete the step
                    if (step === undefined) {
                      setPostprocessing(
                        (postprocessing: PostprocessingConfiguration) => {
                          const newPostprocessing: PostprocessingConfiguration =
                            {
                              postProcessingSteps: [
                                ...postprocessing.postProcessingSteps.slice(
                                  0,
                                  index
                                ),
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
                    // If step is not undefined, update the step
                    setPostprocessing(
                      (postprocessing: PostprocessingConfiguration) => {
                        const newPostprocessing: PostprocessingConfiguration = {
                          postProcessingSteps: [
                            ...postprocessing.postProcessingSteps.slice(
                              0,
                              index
                            ),
                            step,
                            ...postprocessing.postProcessingSteps.slice(
                              index + 1
                            ),
                          ],
                          stepProbability: postprocessing.stepProbability,
                        }

                        return newPostprocessing
                      }
                    )
                  }}
                />
              )}
            </div>
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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active == null || over == null) return

    if (active.id === over.id) return

    const oldIndex = order.indexOf(active.id as number)
    const newIndex = order.indexOf(over.id as number)

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

export default PostprocessingPanel
