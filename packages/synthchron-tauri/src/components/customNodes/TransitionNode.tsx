import { Handle, Position } from 'reactflow'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TransitionNode: React.FC<any> = ({ data, isConnectable }) => (
  <>
    <div>
      <label htmlFor='text'>{data.label}</label>
    </div>
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
  </>
)

export default TransitionNode
