import { Connection, Edge, EdgeTypes, Node, NodeTypes } from 'reactflow'

import { ProcessModel } from '@synthchron/simulator'

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
