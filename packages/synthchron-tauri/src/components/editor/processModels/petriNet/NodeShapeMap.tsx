import { PlaceNodeShape } from './customNodes/PlaceNode'
import { TransitionNodeShape } from './customNodes/TransitionNode'

export function NodeShapeMap(type: string) {
  switch (type) {
    case 'Place':
      return <PlaceNodeShape strokeWidth={undefined} label={type} id={'id'} />
    case 'Transition':
      return (
        <TransitionNodeShape
          strokeWidth={undefined}
          label={type}
          data={{ weight: 'weight', label: 'label' }}
        />
      )
  }
}
