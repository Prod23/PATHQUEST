import React from 'react';
import { motion } from 'framer-motion';
import './Controls.css';

const Controls = ({ 
  onVisualize,
  onReset,
  onGenerateMaze,
  onWeightChange,
  onAlgorithmChange,
  selectedAlgorithm,
  isVisualizing,
  canVisualize,
  weight
}) => {
  const algorithms = [
    { id: 'dijkstra', name: 'Dijkstra\'s Algorithm' },
    { id: 'astar', name: 'A* Search' },
    { id: 'fordFulkerson', name: 'Ford-Fulkerson (Max Flow)' }
  ];

  return (
    <div className="controls-container">
      <div className="controls-header">
        <motion.h1 
          className="app-title"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          onClick={onReset}
        >
          PathQuest
        </motion.h1>
        <p className="app-subtitle">Interactive Pathfinding Visualizer</p>
      </div>

      <div className="controls-body">
        <div className="control-group">
          <label htmlFor="algorithm-select">Algorithm:</label>
          <select 
            id="algorithm-select" 
            value={selectedAlgorithm} 
            onChange={(e) => onAlgorithmChange(e.target.value)}
            disabled={isVisualizing}
            className="algorithm-select"
          >
            {algorithms.map(algo => (
              <option key={algo.id} value={algo.id}>
                {algo.name}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="weight-slider">Node Weight:</label>
          <input 
            type="range" 
            id="weight-slider" 
            min="1" 
            max="10" 
            value={weight} 
            onChange={(e) => onWeightChange(parseInt(e.target.value))}
            disabled={isVisualizing}
            className="weight-slider"
          />
          <span className="weight-value">{weight}</span>
        </div>

        <div className="buttons-group">
          <motion.button 
            className="visualize-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onVisualize}
            disabled={!canVisualize || isVisualizing}
          >
            {isVisualizing ? 'Visualizing...' : `Visualize ${selectedAlgorithm === 'dijkstra' ? 'Dijkstra' : selectedAlgorithm === 'astar' ? 'A*' : 'Ford-Fulkerson'}`}
          </motion.button>

          <motion.button 
            className="reset-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            disabled={isVisualizing}
          >
            Reset Grid
          </motion.button>

          <motion.button 
            className="maze-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGenerateMaze}
            disabled={isVisualizing}
          >
            {selectedAlgorithm === 'fordFulkerson' ? 'Prepare Flow Network' : 'Generate Maze'}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
