import React from 'react';
import { motion } from 'framer-motion';
import './Node.css';

const Node = ({ 
  row, 
  col, 
  isStart, 
  isFinish, 
  isWall, 
  isVisited,
  isPath,
  weight,
  onMouseDown, 
  onMouseEnter, 
  onMouseUp 
}) => {
  // Determine the CSS class based on node properties
  const getNodeClassName = () => {
    if (isFinish) return 'node-finish';
    if (isStart) return 'node-start';
    if (isWall) return 'node-wall';
    if (isPath) return 'node-shortest-path';
    if (isVisited) return 'node-visited';
    return '';
  };

  // Determine weight display
  const getWeightDisplay = () => {
    if (weight > 1 && !isStart && !isFinish && !isWall) {
      return weight;
    }
    return '';
  };

  return (
    <motion.div
      id={`node-${row}-${col}`}
      className={`node ${getNodeClassName()}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
      style={{
        backgroundColor: weight > 1 && !isStart && !isFinish && !isWall && !isPath && !isVisited 
          ? `rgba(170, 170, 170, ${Math.min(weight / 10, 0.8)})` 
          : undefined
      }}
    >
      <span className="weight-label">{getWeightDisplay()}</span>
    </motion.div>
  );
};

export default Node;
