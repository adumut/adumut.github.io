const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
const BOARD_COLOR = '#333';
const BLOCK_BORDER_COLOR = '#fff';
const PIECE_COLORS = ['#f00', '#0f0', '#00f', '#f0f', '#ff0', '#0ff', '#fff'];

const board = Array.from({ length: ROWS }, () => Array(COLS).fill(BOARD_COLOR));

const pieces = [
  [
    [1, 1, 1, 1],
  ],
  [
    [1, 1, 1],
    [1, 0, 0],
  ],
  [
    [1, 1, 1],
    [0, 0, 1],
  ],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
];

let currentPiece;
let currentPieceColor;
let currentRow = 0;
let currentCol = 3;
let score = 0;
let isGameOver = false;

function draw() {
  drawBoard();
  drawPiece();
  drawScore();
}

function drawBoard() {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      ctx.fillStyle = board[i][j];
      ctx.fillRect(j * BLOCK_SIZE, i * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      ctx.strokeStyle = BLOCK_BORDER_COLOR;
      ctx.strokeRect(j * BLOCK_SIZE, i * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }
  }
}

function drawPiece() {
  for (let i = 0; i < currentPiece.length; i++) {
    for (let j = 0; j < currentPiece[i].length; j++) {
      if (currentPiece[i][j]) {
        ctx.fillStyle = currentPieceColor;
        ctx.fillRect(
          (currentCol + j) * BLOCK_SIZE,
          (currentRow + i) * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE
        );
        ctx.strokeStyle = BLOCK_BORDER_COLOR;
        ctx.strokeRect(
          (currentCol + j) * BLOCK_SIZE,
          (currentRow + i) * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE
        );
      }
    }
  }
}

function drawScore() {
  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function moveDown() {
  if (isValidMove(1, 0)) {
    currentRow++;
  } else {
    placePiece();
    clearRows();
    spawnPiece();
    if (!isValidMove(0, 0)) {
      gameOver();
    }
  }
  draw();
}

function moveLeft() {
  if (isValidMove(0, -1)) {
    currentCol--;
    draw();
  }
}

function moveRight() {
  if (isValidMove(0, 1)) {
    currentCol++;
    draw();
  }
}

function rotatePiece() {
  const rotatedPiece = rotateMatrix(currentPiece);
  if (isValidMove(0, 0, rotatedPiece)) {
    currentPiece = rotatedPiece;
    draw();
  }
}

function isValidMove(rowOffset, colOffset, piece = currentPiece) {
  for (let i = 0; i < piece.length; i++) {
    for (let j = 0; j < piece[i].length; j++) {
      if (
        piece[i][j] &&
        (board[currentRow + i + rowOffset] &&
          board[currentRow + i + rowOffset][currentCol + j + colOffset]) !==
          BOARD_COLOR
      ) {
        return false;
      }
    }
  }
  return true;
}

function placePiece() {
  for (let i = 0; i < currentPiece.length; i++) {
    for (let j = 0; j < currentPiece[i].length; j++) {
      if (currentPiece[i][j]) {
        board[currentRow + i][currentCol + j] = currentPieceColor;
      }
    }
  }
}

function clearRows() {
  for (let i = ROWS - 1; i >= 0; i--) {
    if (board[i].every((cell) => cell !== BOARD_COLOR)) {
      board.splice(i, 1);
      board.unshift(Array(COLS).fill(BOARD_COLOR));
      score += 100;
    }
  }
}

function spawnPiece() {
  currentPiece = getRandomPiece();
  currentPieceColor = getRandomColor();

  // Center the piece horizontally
  const initialCol = Math.floor((COLS - currentPiece[0].length) / 2);
  currentCol = initialCol;

  // Place the piece at the top of the board
  currentRow = 0;
}


function getRandomPiece() {
  return pieces[Math.floor(Math.random() * pieces.length)];
}

function getRandomColor() {
  return PIECE_COLORS[Math.floor(Math.random() * PIECE_COLORS.length)];
}

function rotateMatrix(matrix) {
  const rotated = [];
  const rows = matrix.length;
  const cols = matrix[0].length;
  for (let i = 0; i < cols; i++) {
    rotated.push(Array(rows).fill(0));
  }
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      rotated[j][rows - 1 - i] = matrix[i][j];
    }
  }
  return rotated;
}

function resetGame() {
  score = 0;
  isGameOver = false;
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      board[i][j] = BOARD_COLOR;
    }
  }
  spawnPiece();
}

function gameOver() {
  isGameOver = true;
  alert(`Game Over! Your Score: ${score}`);
  resetGame();
}

document.addEventListener('keydown', (event) => {
  if (!isGameOver) {
    switch (event.code) {
      case 'ArrowDown':
        moveDown();
        break;
      case 'ArrowLeft':
        moveLeft();
        break;
      case 'ArrowRight':
        moveRight();
        break;
      case 'ArrowUp':
        rotatePiece();
        break;
    }
  }
});

function gameLoop() {
  if (!isGameOver) {
    moveDown();
    setTimeout(gameLoop, 500); // Adjust the speed of the game
  }
}

resetGame();
gameLoop();

// Add touch event listeners
let touchStartX, touchStartY, touchEndX, touchEndY;
let swipeThreshold = 50; // Adjust the threshold as needed

document.addEventListener('touchstart', (event) => {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
});

document.addEventListener('touchmove', (event) => {
  touchEndX = event.touches[0].clientX;
  touchEndY = event.touches[0].clientY;
});

document.addEventListener('touchend', handleTouchEnd);

function handleTouchEnd() {
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) < swipeThreshold && deltaY < -swipeThreshold) {
    // Upward swipe
    rotatePiece();
  } else if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal swipe
    switch (true) {
      case deltaX > 0:
        moveRight();
        break;
      case deltaX < 0:
        moveLeft();
        break;
    }
  } else {
    // Vertical swipe
    if (deltaY > 0) {
      moveDown();
    }
  }
}

