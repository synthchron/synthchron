import React, { DragEvent } from 'react';

type RectProps = {
    width: number,
    height: number,
    pos_x: number,
    pos_y: number
}

export const Rect = ({ width, height, pos_x, pos_y }: RectProps) => {

    function handleDrag(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.currentTarget.style.top = e.clientY + "px";
        e.currentTarget.style.left = e.clientX + "px";
    }

    return <div
        draggable
        onDrag={handleDrag}
        style={{
            background: 'gray',
            width: width + 'px',
            height: height + 'px',
            position: 'absolute',
            top: pos_x + 'px',
            left: pos_y + 'px',
            border: 'solid'
    }}>
    </div>
}