import React, { useState, useEffect, useCallback } from 'react';
import Grid from '../Grid/Grid';
import Controls from '../Controls/Controls';
import Sidebar from '../Sidebar/Sidebar';
import { dijkstra, getNodesInShortestPathOrder } from '../../Algorithm/dijkstra';
import { astarSearch, reconstructPath } from '../../Algorithm/astarSearch';
import { fordFulkerson } from '../../Algorithm/ford_fulkerson';
import { motion } from 'framer-motion';
import './PathfindingVisualizer.css';

const PathfindingVisualizer = () => {
  // State variables
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [selectingStart, setSelectingStart] = useState(true);
  const [selectingFinish, setSelectingFinish] = useState(true);
  const [startNode, setStartNode] = useState({ row: null, col: null });
  const [finishNode, setFinishNode] = useState({ row: null, col: null });
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('dijkstra');
  const [currentWeight, setCurrentWeight] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [visitedNodesCount, setVisitedNodesCount] = useState(0);
  const [pathLength, setPathLength] = useState(0);
  const [executionTime, setExecutionTime] = useState(0);

  // Initialize grid on component mount
  useEffect(() => {
    const initialGrid = getInitialGrid();
    setGrid(initialGrid);
  }, []);

  // Create initial grid
  const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 26; row++) {
      const currentRow = [];
      for (let col = 0; col < 60; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  // Create a node
  const createNode = (col, row) => {
    return {
      col,
      row,
      isStart: false,
      isFinish: false,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      isPath: false,
      previousNode: null,
      weight: 1,
      gScore: Infinity,
      fScore: Infinity,
    };
  };

  // Reset the grid
  const resetGrid = () => {
    const newGrid = getInitialGrid();
    setGrid(newGrid);
    setSelectingStart(true);
    setSelectingFinish(true);
    setStartNode({ row: null, col: null });
    setFinishNode({ row: null, col: null });
    setVisitedNodesCount(0);
    setPathLength(0);
    setExecutionTime(0);
    
    // Clear any visualization classes from the DOM
    document.querySelectorAll('.node').forEach(node => {
      node.className = 'node';
    });
  };

  // Handle mouse down on a node
  const handleMouseDown = (row, col) => {
    if (isVisualizing) return;

    if (selectingStart) {
      // Set start node
      const newGrid = updateNodeProperty(grid, row, col, 'isStart', true);
      setGrid(newGrid);
      setSelectingStart(false);
      setStartNode({ row, col });
    } else if (selectingFinish) {
      // Set finish node
      if (grid[row][col].isStart) return; // Can't set finish node on start node
      const newGrid = updateNodeProperty(grid, row, col, 'isFinish', true);
      setGrid(newGrid);
      setSelectingFinish(false);
      setFinishNode({ row, col });
    } else {
      // Toggle wall or set weight
      const newGrid = getNewGridWithUpdatedNode(grid, row, col);
      setGrid(newGrid);
      setMouseIsPressed(true);
    }
  };

  // Handle mouse enter on a node
  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed || isVisualizing) return;
    const newGrid = getNewGridWithUpdatedNode(grid, row, col);
    setGrid(newGrid);
  };

  // Prepare Flow Network for Ford-Fulkerson: make entire grid walls (black)
  const prepareFlowNetwork = () => {
    // Reset grid base
    const baseGrid = getInitialGrid();

    // Make all cells walls with default weight 1
    for (let r = 0; r < baseGrid.length; r++) {
      for (let c = 0; c < baseGrid[0].length; c++) {
        baseGrid[r][c].isWall = true;
        baseGrid[r][c].weight = 1;
        baseGrid[r][c].isVisited = false;
        baseGrid[r][c].isPath = false;
        baseGrid[r][c].previousNode = null;
      }
    }

    // Preserve start and finish nodes; ensure they are not walls
    if (startNode.row !== null) {
      baseGrid[startNode.row][startNode.col].isStart = true;
      baseGrid[startNode.row][startNode.col].isWall = false;
    }
    if (finishNode.row !== null) {
      baseGrid[finishNode.row][finishNode.col].isFinish = true;
      baseGrid[finishNode.row][finishNode.col].isWall = false;
    }

    setGrid(baseGrid);
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setMouseIsPressed(false);
  };

  // Update node property
  const updateNodeProperty = (grid, row, col, property, value) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      [property]: value,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  // Get new grid with updated node (wall or weight)
  const getNewGridWithUpdatedNode = (grid, row, col) => {
    // Don't update start or finish nodes
    if (grid[row][col].isStart || grid[row][col].isFinish) return grid;

    const newGrid = grid.slice();
    const node = newGrid[row][col];

    // Special interaction for Ford-Fulkerson flow network authoring
    if (selectedAlgorithm === 'fordFulkerson') {
      const newNode = {
        ...node,
        isWall: false,            // carve an edge cell
        weight: currentWeight,    // assign capacity
      };
      newGrid[row][col] = newNode;
      return newGrid;
    }

    // Default interaction (maze/pathfinding): toggle wall with weight 1, or set weight if not wall
    if (currentWeight === 1) {
      const newNode = {
        ...node,
        isWall: !node.isWall,
        weight: 1, // Reset weight when toggling wall
      };
      newGrid[row][col] = newNode;
    } else if (!node.isWall) {
      // Only set weight if not a wall
      const newNode = {
        ...node,
        weight: currentWeight,
      };
      newGrid[row][col] = newNode;
    }

    return newGrid;
  };

  // Visualize algorithm
  const visualizeAlgorithm = () => {
    if (isVisualizing) return;
    if (startNode.row === null || finishNode.row === null) {
      alert('Please select both start and finish nodes before visualizing.');
      return;
    }

    setIsVisualizing(true);
    
    // Reset previous visualization
    const newGrid = grid.map(row => 
      row.map(node => ({
        ...node,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        previousNode: null,
        gScore: Infinity,
        fScore: Infinity,
      }))
    );
    
    const startNodeObj = newGrid[startNode.row][startNode.col];
    const finishNodeObj = newGrid[finishNode.row][finishNode.col];
    
    let visitedNodesInOrder = [];
    let nodesInShortestPathOrder = [];
    const startTime = performance.now();
    
    // Run the selected algorithm
    switch (selectedAlgorithm) {
      case 'dijkstra':
        visitedNodesInOrder = dijkstra(newGrid, startNodeObj, finishNodeObj);
        nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNodeObj);
        break;
      case 'astar':
        visitedNodesInOrder = astarSearch(newGrid, startNodeObj, finishNodeObj);
        nodesInShortestPathOrder = reconstructPath(finishNodeObj);
        break;
      case 'fordFulkerson':
        const { maxFlow, maxFlowPath } = fordFulkerson(newGrid, startNodeObj, finishNodeObj);
        visitedNodesInOrder = maxFlowPath || [];
        nodesInShortestPathOrder = maxFlowPath || [];
        break;
      default:
        visitedNodesInOrder = dijkstra(newGrid, startNodeObj, finishNodeObj);
        nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNodeObj);
    }
    
    const endTime = performance.now();
    setExecutionTime(endTime - startTime);
    setVisitedNodesCount(visitedNodesInOrder.length);
    setPathLength(nodesInShortestPathOrder.length);
    
    // Animate the algorithm
    animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  // Animate algorithm visualization
  const animateAlgorithm = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
      }, 10 * i);
    }
  };

  // Animate shortest path
  const animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
        
        // When animation is complete, set isVisualizing to false
        if (i === nodesInShortestPathOrder.length - 1) {
          setTimeout(() => {
            setIsVisualizing(false);
          }, 1000);
        }
      }, 50 * i);
    }
  };

  // Generate random maze
  const generateMaze = () => {
    if (isVisualizing) return;
    // If Ford-Fulkerson is selected, prepare flow network instead of maze
    if (selectedAlgorithm === 'fordFulkerson') {
      prepareFlowNetwork();
      return;
    }

    // Reset grid first
    const newGrid = getInitialGrid();
    
    // Preserve start and finish nodes if they exist
    if (startNode.row !== null) {
      newGrid[startNode.row][startNode.col].isStart = true;
    }
    if (finishNode.row !== null) {
      newGrid[finishNode.row][finishNode.col].isFinish = true;
    }
    
    // Generate random walls (about 30% of the grid)
    for (let row = 0; row < newGrid.length; row++) {
      for (let col = 0; col < newGrid[0].length; col++) {
        if (
          !newGrid[row][col].isStart && 
          !newGrid[row][col].isFinish && 
          Math.random() < 0.3
        ) {
          newGrid[row][col].isWall = true;
        }
      }
    }
    
    setGrid(newGrid);
  };

  // Handle algorithm change
  const handleAlgorithmChange = (algorithm) => {
    setSelectedAlgorithm(algorithm);
  };

  // Handle weight change
  const handleWeightChange = (weight) => {
    setCurrentWeight(weight);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Get message based on current selection state
  const getMessage = () => {
    if (selectingStart) {
      return { text: 'Select the start node!', className: 'message-start' };
    } else if (selectingFinish) {
      return { text: 'Select the finish node!', className: 'message-finish' };
    } else {
      return { text: 'Start and Finish nodes are selected', className: 'message-done' };
    }
  };

  const message = getMessage();

  return (
    <div className="pathfinding-visualizer">
      <Controls 
        onVisualize={visualizeAlgorithm}
        onReset={resetGrid}
        onGenerateMaze={generateMaze}
        onWeightChange={handleWeightChange}
        onAlgorithmChange={handleAlgorithmChange}
        selectedAlgorithm={selectedAlgorithm}
        isVisualizing={isVisualizing}
        canVisualize={!selectingStart && !selectingFinish}
        weight={currentWeight}
      />
      
      <motion.div 
        className={`grid-message ${message.className}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {message.text}
      </motion.div>
      
      <Grid 
        grid={grid}
        mouseIsPressed={mouseIsPressed}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseUp={handleMouseUp}
      />
      
      <Sidebar 
        selectedAlgorithm={selectedAlgorithm}
        visitedNodesCount={visitedNodesCount}
        pathLength={pathLength}
        executionTime={executionTime}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />
    </div>
  );
};

export default PathfindingVisualizer;
