import React from 'react';
import { motion } from 'framer-motion';
import './Sidebar.css';

const Sidebar = ({ 
  selectedAlgorithm,
  visitedNodesCount,
  pathLength,
  executionTime,
  isOpen,
  onToggle
}) => {
  const algorithmInfo = {
    dijkstra: {
      name: "Dijkstra's Algorithm",
      description: "Dijkstra's algorithm is a weighted graph search algorithm that finds the shortest path between nodes. It guarantees the shortest path.",
      timeComplexity: "O(V² + E) or O((V+E)log V) with a priority queue",
      spaceComplexity: "O(V)",
      useCases: "GPS navigation, network routing protocols, finding shortest paths in road networks"
    },
    astar: {
      name: "A* Search Algorithm",
      description: "A* is an informed search algorithm that uses heuristics to find the shortest path. It's more efficient than Dijkstra's for many cases.",
      timeComplexity: "O(E) in the worst case, but often performs better in practice",
      spaceComplexity: "O(V) where V is the number of vertices",
      useCases: "Pathfinding in games, robotics, puzzle solving"
    },
    fordFulkerson: {
      name: "Ford-Fulkerson Algorithm",
      description: "Ford-Fulkerson is used for calculating the maximum flow in a flow network. It finds paths with available capacity and augments them.",
      timeComplexity: "O(E × max_flow) where max_flow is the maximum flow value",
      spaceComplexity: "O(V²) for the residual graph",
      useCases: "Network flow problems, bipartite matching, circulation problems"
    }
  };

  const info = algorithmInfo[selectedAlgorithm] || algorithmInfo.dijkstra;

  return (
    <>
      <motion.div 
        className={`sidebar ${isOpen ? 'open' : ''}`}
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ duration: 0.3 }}
      >
        <button className="close-btn" onClick={onToggle}>×</button>
        
        <div className="sidebar-content">
          <h2 className="algorithm-title">{info.name}</h2>
          
          <div className="info-section">
            <h3>Description</h3>
            <p>{info.description}</p>
          </div>
          
          <div className="info-section">
            <h3>Complexity</h3>
            <p><strong>Time:</strong> {info.timeComplexity}</p>
            <p><strong>Space:</strong> {info.spaceComplexity}</p>
          </div>
          
          <div className="info-section">
            <h3>Common Use Cases</h3>
            <p>{info.useCases}</p>
          </div>
          
          {(visitedNodesCount > 0 || pathLength > 0 || executionTime > 0) && (
            <div className="metrics-section">
              <h3>Current Run Metrics</h3>
              {visitedNodesCount > 0 && (
                <p><strong>Nodes Visited:</strong> {visitedNodesCount}</p>
              )}
              {pathLength > 0 && (
                <p><strong>Path Length:</strong> {pathLength}</p>
              )}
              {executionTime > 0 && (
                <p><strong>Execution Time:</strong> {executionTime.toFixed(2)} ms</p>
              )}
            </div>
          )}
        </div>
      </motion.div>
      
      <motion.button 
        className="toggle-sidebar-btn"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {isOpen ? '›' : 'ℹ'}
      </motion.button>
    </>
  );
};

export default Sidebar;
