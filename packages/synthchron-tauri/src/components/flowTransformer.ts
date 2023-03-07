import { ProcessModel } from '../../../synthchron-simulator/src/types/processModel'

import { RFState } from './react-flow/flowStore'

export const TransformFlowToSimulator = (flow: RFState): ProcessModel => {
  return flow.processModelFlowConfig.serialize(flow.nodes, flow.edges)
}
