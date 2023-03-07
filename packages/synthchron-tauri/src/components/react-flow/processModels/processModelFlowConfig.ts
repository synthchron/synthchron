import { PetriNetProcessModel } from '@synthchron/simulator'
import { EdgeTypes, NodeTypes, Node, Edge, Connection } from 'reactflow'
import { ProcessModel } from '../../../../../synthchron-simulator/src/types/processModel'

export type ProcessModelFlowConfig = {
  processModelType: string
  nodeTypes: NodeTypes
  edgeTypes: EdgeTypes
  checkConnect: (
    connection: Connection,
    sourceNode: Node,
    targetNode: Node
  ) => Connection | null
  serialize: (nodes: Node[], edges: Edge[]) => PetriNetProcessModel
}
