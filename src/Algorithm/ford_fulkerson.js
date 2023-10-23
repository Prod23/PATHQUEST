// export function fordFulkerson(grid, source, sink) {
//     const residualGraph = createResidualGraph(grid);
//     const shortestPaths = []; // Store the shortest paths for each iteration
//     let maxFlow = 0;

//     while (true) {
//         const { hasPath, path } = findAugmentingPath(residualGraph, source, sink);
        
//         if (!hasPath) {
//             break;
//         }

//         shortestPaths.push([...path]); // Save a copy of the current path

//         let minCapacity = Infinity;
//         for (let i = 1; i < path.length; i++) {
//             const from = path[i - 1];
//             const to = path[i];
//             minCapacity = Math.min(minCapacity, residualGraph[from][to]);
//         }

//         for (let i = 1; i < path.length; i++) {
//             const from = path[i - 1];
//             const to = path[i];
//             residualGraph[from][to] -= minCapacity;
//             residualGraph[to][from] += minCapacity;
//         }

//         maxFlow += minCapacity;
//     }

//     // Create a list of nodes corresponding to the max flow path
//     const maxFlowPath = shortestPaths[shortestPaths.length - 1].map(nodeIndex => grid[nodeIndex]);

//     return { maxFlow, maxFlowPath };
// }


// function createResidualGraph(grid) {
//     const numVertices = grid.length;
//     const residualGraph = new Array(numVertices).fill(0).map(() => new Array(numVertices).fill(0));

//     // Build the initial residual graph from the given grid
//     // Assuming grid[i][j] represents the capacity from node i to node j

//     return residualGraph;
// }

// export function findAugmentingPath(residualGraph, source, sink) {
//     const numVertices = residualGraph.length;
//     const visited = new Array(numVertices).fill(false);
//     const queue = [source];
//     const parent = new Array(numVertices).fill(-1);

//     visited[source] = true;

//     while (queue.length > 0) {
//         const currentNode = queue.shift();

//         for (let neighbor = 0; neighbor < numVertices; neighbor++) {
//             if (!visited[neighbor] && residualGraph[currentNode][neighbor] > 0) {
//                 parent[neighbor] = currentNode;
//                 visited[neighbor] = true;
//                 queue.push(neighbor);

//                 if (neighbor === sink) {
//                     const path = [];
//                     let current = sink;
//                     while (current !== source) {
//                         path.unshift(current);
//                         current = parent[current];
//                     }
//                     path.unshift(source);
//                     return { hasPath: true, path };
//                 }
//             }
//         }
//     }

//     return { hasPath: false, path: [] };
// }
