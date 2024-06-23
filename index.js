// Initialize canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game settings
const CANVAS_WIDTH = canvas?.width;
const CANVAS_HEIGHT = canvas?.height;
const SNAKE_PART_SIZE = 10;
const INITIAL_SNAKE_LENGTH = 5;
const GAME_SPEED = 100;

// Calculate the initial position dynamically
// If the canvas width is 400 pixels, CANVAS_WIDTH / 2 equals 200 pixels.
const START_X = Math.floor(CANVAS_WIDTH / 2 / SNAKE_PART_SIZE) * SNAKE_PART_SIZE;
const START_Y = Math.floor(CANVAS_HEIGHT / 2 / SNAKE_PART_SIZE) * SNAKE_PART_SIZE;

// Initial snake position
let snake = Array.from({ length: INITIAL_SNAKE_LENGTH }, (_, i) => ({
  x: START_X - i * SNAKE_PART_SIZE,
  y: START_Y,
}));

// Initial food position
let food = { x: 0, y: 0 };

// Movement direction
let dx = SNAKE_PART_SIZE;
let dy = 0;

// High scores list
const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

// Main game loop
function main() {
  if (checkGameOver()) return;
  setTimeout(() => {
    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
    main();
  }, GAME_SPEED);
}

// Initialize game setup
createFood();
document.addEventListener("keydown", changeDirection);
main();
displayHighScores();

// Clear the canvas
function clearCanvas() {
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// Draw individual snake part
function drawSnakePart(snakePart) {
  ctx.fillStyle = "lightgreen";
  ctx.strokeStyle = "darkgreen";
  ctx.fillRect(snakePart.x, snakePart.y, SNAKE_PART_SIZE, SNAKE_PART_SIZE);
  ctx.strokeRect(snakePart.x, snakePart.y, SNAKE_PART_SIZE, SNAKE_PART_SIZE);
}

// Draw the entire snake
function drawSnake() {
  snake.forEach(drawSnakePart);
}

// Generate a random position for food
function randomFood(min, max) {
  return Math.round((Math.random() * (max - min) + min) / SNAKE_PART_SIZE) * SNAKE_PART_SIZE;
}

// Create a new food item
function createFood() {
  food.x = randomFood(0, CANVAS_WIDTH - SNAKE_PART_SIZE);
  food.y = randomFood(0, CANVAS_HEIGHT - SNAKE_PART_SIZE);
}

// Draw the food item
function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, SNAKE_PART_SIZE, SNAKE_PART_SIZE);
}

// Move the snake in the current direction
function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    createFood();
  } else {
    snake.pop();
  }
}

// Change direction based on key pressed
function changeDirection(event) {
  const { keyCode } = event;
  const goingUp = dy === -SNAKE_PART_SIZE;
  const goingDown = dy === SNAKE_PART_SIZE;
  const goingRight = dx === SNAKE_PART_SIZE;
  const goingLeft = dx === -SNAKE_PART_SIZE;

  switch (keyCode) {
    case 37: // Left arrow key
      if (!goingRight) {
        dx = -SNAKE_PART_SIZE;
        dy = 0;
      }
      break;
    case 38: // Up arrow key
      if (!goingDown) {
        dx = 0;
        dy = -SNAKE_PART_SIZE;
      }
      break;
    case 39: // Right arrow key
      if (!goingLeft) {
        dx = SNAKE_PART_SIZE;
        dy = 0;
      }
      break;
    case 40: // Down arrow key
      if (!goingUp) {
        dx = 0;
        dy = SNAKE_PART_SIZE;
      }
      break;
  }
}

// Check if the game is over
function checkGameOver() {
  for (let i = 4; i < snake?.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }

  const hitWall =
    snake[0].x < 0 || snake[0].x >= CANVAS_WIDTH || snake[0].y < 0 || snake[0].y >= CANVAS_HEIGHT;

  if (hitWall) {
    const score = snake?.length;
    const name = prompt("Game Over! Enter your name:");
    saveHighScore(score, name);
    return true;
  }
  return false;
}

// Save high score to local storage
function saveHighScore(score, name) {
  if (!name || name.trim() === "") {
    name = "Atul_Test";
  }
  const newScore = { score, name };
  highScores.push(newScore);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(5);
  localStorage.setItem("highScores", JSON.stringify(highScores));
  displayHighScores();
}

// Display high scores on the leaderboard
function displayHighScores() {
  highScoresList.innerHTML = highScores
    .map((score) => `<li>${score?.name} - ${score?.score}</li>`)
    .join("");
}
