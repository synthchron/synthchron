import React from 'react'
import { PlaceNodeShape } from './petriNet/customNodes/PlaceNode'
import { TransitionNodeShape } from './petriNet/customNodes/TransitionNode'

export function NodeShapeMap(type: string) {
  switch (type) {
    case 'Place':
      return <PlaceNodeShape strokeWidth={undefined} label={type} />
    case 'Transition':
      return <TransitionNodeShape strokeWidth={undefined} label={type} />
  }
}
