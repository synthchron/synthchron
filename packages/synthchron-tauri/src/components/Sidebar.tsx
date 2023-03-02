import React from 'react';

export default () => {
  const onDragStart = (event : any, nodeType : any) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'Place')} draggable>
        Place node
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'Transition')} draggable>
        Transition node
      </div>
    </aside>
  );
};
