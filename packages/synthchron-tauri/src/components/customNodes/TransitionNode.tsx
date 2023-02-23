import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

const handleStyle = { left: 10 };

//@ts-ignore
function TransitionNode({ data, isConnectable } ) {

  const onChange = useCallback((evt : any) => {
    console.log(evt.target.value);
  }, []);

  return (
    <>
      <div>
        <label htmlFor="text">{data.label}</label>
      </div>
      <Handle type="source" position={Position.Top} id="a" isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
      <Handle type="source" position={Position.Right} id="c" isConnectable={isConnectable} />
      <Handle type="source" position={Position.Left} id="d" isConnectable={isConnectable} />
    </>
  );
}


export default TransitionNode;
