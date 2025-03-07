const gridContainer = document.getElementById("grid");
let startPos = null;
let endPos = null;
const rows = 20, cols = 20;
let grid = Array.from({ length: rows }, () => Array(cols).fill(0));

function createGrid() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = r;
            cell.dataset.col = c;
            
            cell.addEventListener("click", () => handleCellClick(cell, r, c));
            gridContainer.appendChild(cell);
        }
    }
}

function handleCellClick(cell, r, c) {
    if (!startPos) {
        cell.classList.add("start");
        startPos = { row: r, col: c };
        grid[r][c] = "S";
    } else if (!endPos) {
        cell.classList.add("end");
        endPos = { row: r, col: c };
        grid[r][c] = "E";
    } else {
        cell.classList.toggle("obstacle");
        grid[r][c] = cell.classList.contains("obstacle") ? 1 : 0;
    }
}

function findPath() {
    if (!startPos || !endPos) {
        alert("Set start and end points first!");
        return;
    }
    dijkstra(startPos, endPos);
}

function dijkstra(start, end) {
    let distances = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
    let parent = {};
    let pq = [{ row: start.row, col: start.col, dist: 0 }];
    distances[start.row][start.col] = 0;
    
    let directions = [
        { dr: -1, dc: 0 }, { dr: 1, dc: 0 }, 
        { dr: 0, dc: -1 }, { dr: 0, dc: 1 }
    ];
    
    while (pq.length > 0) {
        pq.sort((a, b) => a.dist - b.dist);
        let { row, col, dist } = pq.shift();
        
        if (row === end.row && col === end.col) {
            reconstructPath(parent, end);
            return;
        }
        
        for (let { dr, dc } of directions) {
            let newRow = row + dr, newCol = col + dc;
            if (
                newRow >= 0 && newRow < rows &&
                newCol >= 0 && newCol < cols &&
                grid[newRow][newCol] !== 1
            ) {
                let newDist = dist + 1;
                if (newDist < distances[newRow][newCol]) {
                    distances[newRow][newCol] = newDist;
                    pq.push({ row: newRow, col: newCol, dist: newDist });
                    parent[`${newRow},${newCol}`] = { row, col };
                }
            }
        }
    }
    alert("No path found!");
}

function reconstructPath(parent, end) {
    let { row, col } = end;
    while (`${row},${col}` in parent) {
        let cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
        cell.classList.add("path");
        ({ row, col } = parent[`${row},${col}`]);
    }
}

createGrid();