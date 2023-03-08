import { ProcessModel } from '@synthchron/simulator'
import { EdgeTypes, NodeTypes, Node, Connection, Edge } from 'reactflow'

type RFStateInit = {
  nodes: Node[]
  edges: Edge[]
}

export type ProcessModelFlowConfig = {
  nodeTypes: NodeTypes
  edgeTypes: EdgeTypes
  checkConnect: (
    connection: Connection,
    sourceNode: Node,
    targetNode: Node
  ) => Connection | null
  generateFlow: (processModel: ProcessModel) => RFStateInit
}
