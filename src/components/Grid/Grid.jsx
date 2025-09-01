import React from 'react';
import Node from '../Node/Node';
import './Grid.css';

const Grid = ({ 
  grid, 
  mouseIsPressed,
  onMouseDown,
  onMouseEnter,
  onMouseUp
}) => {
  return (
    <div className="grid-container">
      {grid.map((row, rowIdx) => (
        <div key={rowIdx} className="grid-row">
          {row.map((node, nodeIdx) => {
            const { row, col, isStart, isFinish, isWall, isVisited, isPath, weight } = node;
            return (
              <Node
                key={nodeIdx}
                row={row}
                col={col}
                isStart={isStart}
                isFinish={isFinish}
                isWall={isWall}
                isVisited={isVisited}
                isPath={isPath}
                weight={weight}
                mouseIsPressed={mouseIsPressed}
                onMouseDown={onMouseDown}
                onMouseEnter={onMouseEnter}
                onMouseUp={onMouseUp}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Grid;
