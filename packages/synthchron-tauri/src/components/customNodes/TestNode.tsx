import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

const handleStyle = { left: 10 };

//@ts-ignore
function PlaceNode({ data, isConnectable } ) {
  const onChange = useCallback((evt : any) => {
    console.log(evt.target.value);
  }, []);
  return (
    <div className="MeaningLess">
      <div>
        <label htmlFor="text"></label>
      </div>
      <div className="tokenContainer">
        <div className="token"></div>
        <div className="token"></div>
        <div className="token"></div>
        <div className="token"></div>
        <div className="token"></div>
        <div className="token"></div>
        <div className="token"></div>
        <div className="token"></div>
        <div className="token"></div>
      </div>
      <Handle type="source" position={Position.Top} id="a" isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
      <Handle type="source" position={Position.Right} id="c" isConnectable={isConnectable} />
      <Handle type="source" position={Position.Left} id="d" isConnectable={isConnectable} />
    </div>
  );
}


export default PlaceNode;
