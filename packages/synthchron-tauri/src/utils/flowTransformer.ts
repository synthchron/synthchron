import { ProcessModel } from '../../../synthchron-simulator/src/types/processModel'

import { EditorState } from './react-flow/editorStore/flowStore'

export const transformFlowToSimulator = (flow: EditorState): ProcessModel => {
  return flow.processModelFlowConfig.serialize(
    flow.nodes,
    flow.edges,
    flow.meta
  )
}
