import { useCallback } from 'react';
import {Handle, MarkerType, Position, useReactFlow} from 'reactflow';

const handleStyle = { left: 10 };


//@ts-ignore
function PlaceNode({ data, isConnectable } ) {

    const reactFlowInstance = useReactFlow();
    
    function connect(params: any) {
			// if you want to do something on connect....
    }

  return (
    <>
      <div className="node-label">{data.label}</div>
      <div className="handleContainer">
        <Handle onConnect={(params: any) => connect(params)} type="source" position={Position.Top} id="a" isConnectable={isConnectable} />
        <Handle onConnect={(params: any) => connect(params)} type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
        <Handle onConnect={(params: any) => connect(params)} type="source" position={Position.Right} id="c" isConnectable={isConnectable} />
        <Handle onConnect={(params: any) => connect(params)} type="source" position={Position.Left} id="d" isConnectable={isConnectable} />
      </div>
      <label htmlFor="text">{data.store}</label>
      
    </>
  );
}


export default PlaceNode;
