import { Handle, Position } from 'reactflow'

import './NodeStyle.css'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
function PlaceNode({ data, isConnectable }) {
  return (
    <>
      <div className='node-label'>{data.label}</div>
      <div className='handleContainer'>
        <Handle
          type='source'
          position={Position.Top}
          id='a'
          isConnectable={isConnectable}
        />
        <Handle
          type='source'
          position={Position.Bottom}
          id='b'
          isConnectable={isConnectable}
        />
        <Handle
          type='source'
          position={Position.Right}
          id='c'
          isConnectable={isConnectable}
        />
        <Handle
          type='source'
          position={Position.Left}
          id='d'
          isConnectable={isConnectable}
        />
      </div>
      <label htmlFor='text'>{data.store}</label>
    </>
  )
}

export default PlaceNode
