import { ProcessModel } from '@synthchron/simulator'
import { EdgeTypes, NodeTypes, Node, Connection, Edge } from 'reactflow'

type RFStateInit = {
  nodes: Node[]
  edges: Edge[]
  meta: object
}

export type ProcessModelFlowConfig = {
  processModelType: string
  nodeTypes: NodeTypes
  edgeTypes: EdgeTypes
  checkConnect: (
    connection: Connection,
    sourceNode: Node,
    targetNode: Node
  ) => Connection | null
  generateFlow: (processModel: ProcessModel) => RFStateInit
  serialize: (nodes: Node[], edges: Edge[], meta: object) => ProcessModel // Get a list of nodes, a list of edges, and model specific meta information, and create a ProcessModel
}
