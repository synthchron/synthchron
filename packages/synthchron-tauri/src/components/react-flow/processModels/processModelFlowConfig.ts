import { EdgeTypes, NodeTypes, Node, Connection } from 'reactflow'

export type ProcessModelFlowConfig = {
  nodeTypes: NodeTypes
  edgeTypes: EdgeTypes
  checkConnect: (
    connection: Connection,
    sourceNode: Node,
    targetNode: Node
  ) => Connection | null
}
