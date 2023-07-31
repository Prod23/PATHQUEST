import React,{Component} from 'react';
import Node from './Node/Node';
import {dijkstra,getNodesInShortestPathOrder} from '../Algorithm/dijkstra';
import './pfv.css';
// const START_NODE_ROW = 0;
// const START_NODE_COL = 0;
// const FINISH_NODE_ROW = 20;
// const FINISH_NODE_COL = 20;

export default class PathfindingVisualizer extends Component{
    constructor(){
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
            selectingStart: true,
            selectingFinish: true,
            startNodeRow: null,
            startNodeCol: null,
            finishNodeRow: null,
            finishNodeCol: null,
        };
    }
    componentDidMount(){
        const grid = getInitialGrid();
        this.setState({grid});
    }
    
    handleMouseDown = (row, col) => {
        const { selectingStart, selectingFinish, grid } = this.state;
      
        // If we are selecting the start node
        if (selectingStart) {
          // If the clicked node is already the finish node, do nothing
          if (grid[row][col].isFinish) {
            this.setState({ selectingStart: true });
          } else {
            // Set the start node
            const updatedGrid = updateNodeToStart(grid,row,col);
            this.setState({
              grid: updatedGrid,
              selectingStart: false,
              startNodeRow: row,
              startNodeCol: col,
            });
            console.log('row of start: %d column of start: %d ', row,col);
          }
        }
        // If we are selecting the finish node
        else if (selectingFinish) {
          // If the clicked node is already the start node, do nothing
          if (grid[row][col].isStart) {
            this.setState({ selectingFinish: true });
          } else {
            // Set the finish node
            const updatedGrid = updateNodeToFinish(grid,row,col);
            this.setState({
              grid: updatedGrid,  
              selectingFinish: false,
              finishNodeRow: row,
              finishNodeCol: col,
            });
            console.log('row of finish: %d column of finish: %d', row,col);
          }
        } else {
          // Toggling wall or other logic when the user clicks on the grid
          const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
          this.setState({ grid: newGrid, mouseIsPressed: true });
        }
      };
      
    
    handleMouseEnter = (row, col) => {
        if (!this.state.mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({ grid: newGrid });
      };
    
    handleMouseUp = () => {
        this.setState({ mouseIsPressed: false });
      };
    handleLogoClick = () => {
        window.location.reload();
    };
      
    animateDijkstra(visitedNodesInOrder,nodesInShortestPathOrder){
        for(let i = 0;i <= visitedNodesInOrder.length;i++){
            if(i === visitedNodesInOrder.length){
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder)
                },25*i)
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                // const newGrid = this.state.grid.slice();
                // const newNode = {
                //     ...node,
                //     isVisited: true,
                // };
                //newGrid[node.row][node.col] = newNode;
                // console.log(document.getElementById(`node-${node.row}-${node.col}`));
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
                // setTimeout(() => {
                //     this.setState({grid: newGrid});
                // },100);
                //this.setState({grid: newGrid});
            },25*i);
        }
    }

    animateShortestPath(nodesInShortestPathOrder){
        for(let i = 0;i < nodesInShortestPathOrder.length;i++){
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i]; 
                // const newGrid = this.state.grid.slice();
                // const newNode = {
                //     ...node,
                //     isVisited: true,
                // };
                // newGrid[node.row][node.col] = newNode;
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
            },40*i)
        }
    }
    visualizeDijkstra(){
        const {grid,startNodeRow,startNodeCol,finishNodeRow,finishNodeCol} = this.state;
        const startNode = grid[startNodeRow][startNodeCol];
        const finishNode = grid[finishNodeRow][finishNodeCol];
        // If start or finish nodes are not set, return without visualizing
        if (!startNode || !finishNode) {
            console.log("Please select both start and finish nodes before visualizing.");
            return;
        }
        // this.setState({selectingStart: false,selectingFinish: false});
        const visitedNodesInOrder = dijkstra(grid,startNode,finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
        console.log(visitedNodesInOrder);
    }
    vibrateMessage() {
        const { selectingStart, selectingFinish } = this.state;
        if (selectingStart || selectingFinish) {
            const messageElement = document.querySelector('.messageStart') || document.querySelector('.messageFinish');
            if (messageElement) {
                messageElement.classList.add('vibrate-animation');
                setTimeout(() => {
                    messageElement.classList.remove('vibrate-animation');
                }, 500);
            }
        }
    }
    render(){
        const {grid,mouseIsPressed,selectingStart,selectingFinish} = this.state;
        let message;
        let messageClassName;
        if(selectingStart){
            message = 'Select the start node!';
            messageClassName = 'messageStart';
        }
        else if(selectingFinish){
            message = 'Select the finish node!';
            messageClassName = 'messageFinish';
        }
        else{
            message = 'Start and Finish nodes are selected';
            messageClassName = 'messageDone';
        }
        return(
            <>
                <div className = "background">
                <div class="navbar">
                    <div class = "nav-brand" onClick={this.handleLogoClick}>
                        <span class="logo">PATH FINDER</span>
                    </div>
                    <div class="nav-menu">
                        *click the logo to reset the grid
                    </div>
                </div>
                <div class="dropdown-content">
                    <button onClick={() => (selectingStart || selectingFinish) ? this.vibrateMessage() : this.visualizeDijkstra()}>
                        Visualize Dijkstra's Algorithm
                    </button>
                </div>
                <div className = "grid">
                    <div className = {messageClassName}>{message}</div>
                    {grid.map((row,rowidx) => {
                        return (
                        <div key={rowidx} className = "nodes">
                            {row.map((node,nodeidx) => {
                                const {row,col,isStart,isFinish,isWall} = node;
                                return (
                                <Node key={nodeidx} col={col} isFinish={isFinish} isStart={isStart} isWall={isWall} mouseIsPressed = {mouseIsPressed} onMouseDown = {(row,col) => this.handleMouseDown(row,col)} onMouseEnter={(row,col) => this.handleMouseEnter(row,col)} onMouseUp = {() => this.handleMouseUp()} row={row}></Node>
                                );
                            })}
                        </div>
                        );
                    })}
                </div>
                </div>
            </>
        );
    }
}
//Refactoring merging ui logic with algorithm logic
const getInitialGrid = () => {
    const grid = [];
    for(let row = 0;row < 26;row++){
        const currentRow = [];
        for(let col = 0; col < 60;col++){
            currentRow.push(createNode(col,row));
        }
        grid.push(currentRow);
    }
    return grid;
};
const createNode =(col,row) => {
    return {
        col,
        row,
        isStart: false,
        isFinish: false,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
};
const updateNodeToStart = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isStart: true,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };
const updateNodeToFinish = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isFinish: true,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };
// const updateNode = (grid, row, col, updatedNode) => {
//     const newGrid = grid.map((rowNodes, rowIndex) =>
//         rowNodes.map((node, colIndex) => {
//         if (rowIndex === row && colIndex === col) {
//             return updatedNode;
//         }
//         return node;
//         })
//     );
//     return newGrid;
// };

const getNewGridWithWallToggled = (grid,row,col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
        isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};