export function astarSearch(grid, startNode, finishNode) {
  const openSet = [];
  const closedSet = [];
  const allVisitedNodes = []; // New array to track all visited nodes
  startNode.gScore = 0;
  startNode.fScore = heuristic(startNode, finishNode);
  openSet.push(startNode);

  while (!!openSet.length) {
    const currentNode = getLowestFScoreNode(openSet);

    if (currentNode === finishNode) {
      return allVisitedNodes;
    }

    removeFromArray(openSet, currentNode);
    closedSet.push(currentNode);
    currentNode.isVisited = true;
    allVisitedNodes.push(currentNode); // Add the current node to allVisitedNodes

    const neighbors = getNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      neighbor.isVisited = true; // Set isVisited to true for all neighbors
      if (closedSet.includes(neighbor) || neighbor.isWall) {
        continue;
      }

      const tentativeGScore = currentNode.gScore + 1;
      if (!openSet.includes(neighbor) || tentativeGScore < neighbor.gScore) {
        neighbor.previousNode = currentNode;
        neighbor.gScore = tentativeGScore;
        neighbor.fScore = neighbor.gScore + heuristic(neighbor, finishNode);

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return allVisitedNodes;
}
  
  function getLowestFScoreNode(openSet) {
    let lowestNode = openSet[0];
    for (const node of openSet) {
      node.isVisited = true;
      if (node.fScore < lowestNode.fScore) {
        lowestNode = node;
      }
    }
    return lowestNode;
  }
  
  function heuristic(nodeA, nodeB) {
    const dx = Math.abs(nodeA.col - nodeB.col);
    const dy = Math.abs(nodeA.row - nodeB.row);
    return dx + dy;
  }
  
  function removeFromArray(array, item) {
    const index = array.indexOf(item);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
  
  function getNeighbors(node, grid) {
    const neighbors = [];
    const { row, col } = node;
  
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  
    return neighbors;
  }
  
  export function reconstructPath(node) {
    const path = [];
    let currentNode = node;
    while (currentNode !== null) {
      path.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return path;
  }