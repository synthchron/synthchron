import { ProcessModel } from '@synthchron/simulator'
import { EdgeTypes, NodeTypes, Node, Connection, Edge } from 'reactflow'

type RFStateInit = {
  nodes: Node[]
  edges: Edge[]
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
  serialize: (nodes: Node[], edges: Edge[]) => ProcessModel
  temp: (element: Node | Edge) => Properties[]
}

type TextFields = {
  type: 'TextFields'
  label: string
}
type NumberFields = {
  type: 'NumberFields'
  number: number
} //Change identifiers!!!
type Properties = TextFields | NumberFields
