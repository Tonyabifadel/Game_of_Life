// Define the grid size
const rows = 30;
const cols = 50;
let grid = createGrid(rows, cols);
let intervalId = null;

// Predefined patterns
const patterns = {
  glider: [
    [1, 0, 0],
    [0, 1, 1],
    [1, 1, 0]
  ],
  blinker: [
    [1, 1, 1]
  ],
  beehive: [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [0, 1, 1, 0]
  ],
  pulsar: [
    [0, 0, 1, 1, 1, 0, 0],
    [1, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 1, 1, 0, 0]
  ]
};

// Function to create a grid with dead cells
function createGrid(rows, cols) {
  const grid = [];
  for (let row = 0; row < rows; row++) {
    const newRow = [];
    for (let col = 0; col < cols; col++) {
      newRow.push(0); // Start with all cells dead (0)
    }
    grid.push(newRow);
  }
  return grid;
}

// Render the grid
function renderGrid() {
  const gridContainer = document.getElementById('grid');
  gridContainer.innerHTML = '';

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      if (grid[row][col] === 1) {
        cell.classList.add('alive');
      }

      cell.addEventListener('click', () => {
        grid[row][col] = grid[row][col] ? 0 : 1; // Toggle cell state
        renderGrid();
      });

      gridContainer.appendChild(cell);
    }
  }
}

// Function to add a pattern at a given position
function addPattern(patternName, startRow, startCol) {
  const pattern = patterns[patternName];
  if (!pattern) return;

  for (let row = 0; row < pattern.length; row++) {
    for (let col = 0; col < pattern[row].length; col++) {
      grid[startRow + row][startCol + col] = pattern[row][col];
    }
  }
  renderGrid();
}

// Event listener for adding a pattern
document.getElementById('addPattern').addEventListener('click', () => {
  const selectedPattern = document.getElementById('patterns').value;

  // Place pattern randomly, or customize with specific coordinates
  const startRow = Math.floor(Math.random() * (rows - patterns[selectedPattern].length));
  const startCol = Math.floor(Math.random() * (cols - patterns[selectedPattern][0].length));

  addPattern(selectedPattern, startRow, startCol);
});

// Function to calculate next generation
function nextGeneration() {
  const newGrid = createGrid(rows, cols);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const liveNeighbors = countLiveNeighbors(grid, row, col);

      if (grid[row][col] === 1) {
        if (liveNeighbors === 2 || liveNeighbors === 3) {
          newGrid[row][col] = 1;
        }
      } else {
        if (liveNeighbors === 3) {
          newGrid[row][col] = 1;
        }
      }
    }
  }

  grid = newGrid;
  renderGrid();
}

// Count live neighbors
function countLiveNeighbors(grid, x, y) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const row = (x + i + rows) % rows;
      const col = (y + j + cols) % cols;
      count += grid[row][col];
    }
  }
  return count;
}

// Start, stop, and reset functionality
function startGame() {
  if (!intervalId) {
    intervalId = setInterval(nextGeneration, 100);
  }
}

function stopGame() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function resetGame() {
  stopGame();
  grid = createGrid(rows, cols);
  renderGrid();
}

// Event listeners for controls
document.getElementById('start').addEventListener('click', startGame);
document.getElementById('stop').addEventListener('click', stopGame);
document.getElementById('reset').addEventListener('click', resetGame);

// Initial render of the grid
renderGrid();
