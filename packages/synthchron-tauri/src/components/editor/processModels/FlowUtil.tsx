import { edgeTypes, nodeTypes } from './petriNet/petriNetFlowConfig'

export function GetElementType(elemType: undefined | string) {
  //Use edges and nodes share the property .type
  //Pattern matching would be nice
  if (elemType) {
    if (nodeTypes[elemType]) {
      return 'node'
    } else if (edgeTypes[elemType]) {
      return 'edge'
    } else {
      return undefined
    }
  } else {
    return undefined
  }
}

export const FlowFieldsToDisplay: { [index: string]: string[] } = {
  Place: ['label', 'tokens'],
  Transition: ['label', 'weight'],
}
