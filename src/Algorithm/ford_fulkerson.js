export function fordFulkerson(grid, source, sink) {
    // Create a capacity graph from the grid
    const capacityGraph = createCapacityGraph(grid);
    
    // Initialize flow graph with zeros
    const flowGraph = Array(grid.length * grid[0].length)
        .fill(0)
        .map(() => Array(grid.length * grid[0].length).fill(0));
    
    // Store all paths found during the algorithm execution
    const allPaths = [];
    let maxFlow = 0;
    
    // Convert source and sink objects to indices
    const sourceIndex = nodeToIndex(source, grid[0].length);
    const sinkIndex = nodeToIndex(sink, grid[0].length);
    
    // Run Ford-Fulkerson algorithm
    while (true) {
        // Find an augmenting path using BFS
        const { hasPath, path } = findAugmentingPath(capacityGraph, flowGraph, sourceIndex, sinkIndex, grid);
        
        if (!hasPath) {
            break;
        }
        
        // Find the minimum residual capacity along the path
        let minCapacity = Infinity;
        for (let i = 0; i < path.length - 1; i++) {
            const u = path[i];
            const v = path[i + 1];
            const residualCapacity = capacityGraph[u][v] - flowGraph[u][v];
            minCapacity = Math.min(minCapacity, residualCapacity);
        }
        
        // Update flow along the path
        for (let i = 0; i < path.length - 1; i++) {
            const u = path[i];
            const v = path[i + 1];
            flowGraph[u][v] += minCapacity;
            flowGraph[v][u] -= minCapacity; // Reverse edge for residual graph
        }
        
        maxFlow += minCapacity;
        
        // Convert path indices to grid nodes for visualization
        const pathNodes = path.map(index => indexToNode(index, grid[0].length, grid));
        allPaths.push(pathNodes);
    }
    
    // Flatten all paths for visualization
    const visitedNodes = allPaths.flat();
    
    // Get the final max flow path (last path found)
    const maxFlowPath = allPaths.length > 0 ? allPaths[allPaths.length - 1] : [];
    
    return { maxFlow, maxFlowPath, visitedNodes };
}

// Convert a node object to a flat index
function nodeToIndex(node, gridWidth) {
    return node.row * gridWidth + node.col;
}

// Convert a flat index back to a node object
function indexToNode(index, gridWidth, grid) {
    const row = Math.floor(index / gridWidth);
    const col = index % gridWidth;
    return grid[row][col];
}

// Create a capacity graph from the grid
function createCapacityGraph(grid) {
    const numNodes = grid.length * grid[0].length;
    const capacityGraph = Array(numNodes).fill(0).map(() => Array(numNodes).fill(0));
    
    // For each node in the grid
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            const node = grid[row][col];
            const nodeIndex = nodeToIndex(node, grid[0].length);
            
            // Skip walls
            if (node.isWall) continue;
            
            // Get neighbors
            const neighbors = getNeighbors(node, grid);
            
            // For each neighbor, set capacity
            for (const neighbor of neighbors) {
                const neighborIndex = nodeToIndex(neighbor, grid[0].length);
                
                // Treat node weights as capacities directly for FF mode
                // If neighbor is a wall, capacity is 0; otherwise capacity = neighbor.weight
                const capacity = neighbor.isWall ? 0 : neighbor.weight;
                capacityGraph[nodeIndex][neighborIndex] = capacity;
            }
        }
    }
    
    return capacityGraph;
}

// Get valid neighbors of a node
function getNeighbors(node, grid) {
    const neighbors = [];
    const { row, col } = node;
    const numRows = grid.length;
    const numCols = grid[0].length;
    
    // Check all four directions
    if (row > 0) neighbors.push(grid[row - 1][col]); // Up
    if (row < numRows - 1) neighbors.push(grid[row + 1][col]); // Down
    if (col > 0) neighbors.push(grid[row][col - 1]); // Left
    if (col < numCols - 1) neighbors.push(grid[row][col + 1]); // Right
    
    return neighbors;
}

// Find an augmenting path using BFS
export function findAugmentingPath(capacityGraph, flowGraph, source, sink, grid) {
    const numNodes = capacityGraph.length;
    const visited = Array(numNodes).fill(false);
    const parent = Array(numNodes).fill(-1);
    const queue = [source];
    
    visited[source] = true;
    
    while (queue.length > 0) {
        const u = queue.shift();
        
        for (let v = 0; v < numNodes; v++) {
            // If there's residual capacity and v is not visited
            if (!visited[v] && capacityGraph[u][v] > flowGraph[u][v]) {
                queue.push(v);
                parent[v] = u;
                visited[v] = true;
                
                if (v === sink) {
                    // Reconstruct the path
                    const path = [];
                    for (let curr = sink; curr !== -1; curr = parent[curr]) {
                        path.unshift(curr);
                    }
                    return { hasPath: true, path };
                }
            }
        }
    }
    
    return { hasPath: false, path: [] };
}
