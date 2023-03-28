import { ProcessModelType } from '../types/processModel'
import { FlowchartProcessModel } from '../types/processModelTypes/flowChart'

export const flowchart1: FlowchartProcessModel = {
  type: ProcessModelType.Flowchart,
  nodes: [
    {
      type: 'terminal',
      identifier: 'n1',
      name: 'n1',
    },
    {
      type: 'decision',
      identifier: 'n2',
      name: 'n2',
    },
    {
      type: 'terminal',
      identifier: 'n3',
      name: 'n4',
    },
  ],
  edges: [
    {
      source: 'n1',
      target: 'n2',
      weight: 1,
      name: 'e1',
    },
    {
      source: 'n2',
      target: 'n3',
      weight: 1,
      name: 'e2',
    },
  ],
  initialNode: 'n1',
}

export const flowchart2: FlowchartProcessModel = {
  type: ProcessModelType.Flowchart,
  nodes: [
    {
      type: 'terminal',
      identifier: 'n1',
      name: 'n1',
    },
    {
      type: 'decision',
      identifier: 'n2',
      name: 'n2',
    },
    {
      type: 'terminal',
      identifier: 'n3',
      name: 'n3',
    },
    {
      type: 'terminal',
      identifier: 'n4',
      name: 'n4',
    },
  ],
  edges: [
    {
      source: 'n1',
      target: 'n2',
      weight: 1,
      name: 'e1',
    },
    {
      source: 'n2',
      target: 'n3',
      weight: 1,
      name: 'e2',
    },
    {
      source: 'n2',
      target: 'n4',
      weight: 1,
      name: 'e3',
    },
  ],
  initialNode: 'n1',
}
