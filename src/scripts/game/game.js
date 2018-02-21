import colors from './models/colors';
import directions from './models/directions';

export default class Game {

  constructor(gridId, width, height) {
    // Set the canvas
    this.setCanvas(gridId, width, height);
    // Set the default option values
    this.setOptions();
    // Initialize the snake
    this.setSnake();
    // Initialize the food
    this.setFood();
    // Direction event listener
    this.directionEvent();
    // Run the game
    this.run();
  }

  // Run the game
  run() {
    this.interval = setInterval(() => this.draw(), 100);
  }

  // Set the canvas
  setCanvas(gridId, width, height) {
    this.canvas = document.getElementById(gridId);
    this.context = this.canvas.getContext('2d');
    this.canvas.width = width;
    this.canvas.height = height;
  }

  // Set the default option values
  setOptions() {
    // Set the pixel size for each object
    this.px = 32;
    // Set the direction
    this.direction = '';
    // Set the score
    this.score = 0;
  }

  // Initialize the snake
  setSnake() {
    this.snake = [];
    const newHead = {
      x: 9 * this.px,
      y: 10 * this.px
    };
    this.snake.push(newHead);
  }

  // Initialize the food
  setFood() {
    // Need to add a check to make sure food isn't at the same spot as the snake
    this.food = {
      x: Math.floor(Math.random() * (this.canvas.width / 40) + 1) * this.px,
      y: Math.floor(Math.random() * (this.canvas.width / 40) + 3) * this.px
    };
  }

  // Direction event handler
  directionEvent() {
    document.addEventListener('keydown', (event) => {
      // Track the event keycode
      const key = event.keyCode;
      // Check if the left arrow key was pressed
      if (key === directions.left.code && this.direction !== directions.right.name) {
        this.direction = directions.left.name;
        // Check if the up arrow key was pressed
      } else if (key === directions.up.code && this.direction !== directions.down.name) {
        this.direction = directions.up.name;
        // Check if the right arrow key was pressed
      } else if (key === directions.right.code && this.direction !== directions.left.name) {
        this.direction = directions.right.name;
        // Check if the down arrow key was pressed
      } else if (key === directions.down.code && this.direction !== directions.up.name) {
        this.direction = directions.down.name;
      }
    });
  }

  // Draw on the canvas
  draw() {
    // Draw the grid
    this.drawGrid();
    // Draw the snake
    this.drawSnake();
    // Draw the food
    this.drawFood();
    // Draw the game
    this.drawGame();
  }

  // Draw the grid
  drawGrid() {
    this.context.fillStyle = colors.grid;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Draw the snake
  drawSnake() {
    for (let i = 0; i < this.snake.length; i++) {
      this.context.fillStyle = (i == 0) ? colors.snake.head : colors.snake.body;
      this.context.fillRect(this.snake[i].x, this.snake[i].y, this.px, this.px);
      this.context.strokeStyle = colors.snake.stroke;
      this.context.strokeRect(this.snake[i].x, this.snake[i].y, this.px, this.px);
    }
  }

  // Draw the food
  drawFood() {
    this.context.fillStyle = colors.food;
    this.context.fillRect(this.food.x, this.food.y, this.px, this.px);
  }

  // Draw the game
  drawGame() {
    // Set head position
    let snakeX = this.snake[0].x;
    let snakeY = this.snake[0].y;

    // Check the direction
    if (this.direction === directions.left.name) snakeX -= this.px;
    if (this.direction === directions.up.name) snakeY -= this.px;
    if (this.direction === directions.right.name) snakeX += this.px;
    if (this.direction === directions.down.name) snakeY += this.px;

    // Check if the snake eats the food
    if (snakeX == this.food.x && snakeY == this.food.y) {
      this.score++;
      this.setFood();
    } else {
      // Remove the tail from the snake
      this.snake.pop();
    }

    // Create new head
    let newHead = {
      x: snakeX,
      y: snakeY
    };

    // Check if the game is over
    if (snakeX < this.px || snakeX > this.canvas.width || snakeY < this.px || snakeY > this.canvas.height || this.selfCollision(newHead, this.snake)) {
      clearInterval(this.interval);
    }

    // Add new head to the snake
    this.snake.unshift(newHead);

    // Draw the score
    this.drawScore();
  }

  // Draw the score
  drawScore() {
    document.getElementById('score').innerText = this.score;
  }

  // Check if the snake collides with itself
  selfCollision(head, snake) {
    for (let i = 0; i < snake.length; i++) {
      if (head.x == snake[i].x && head.y == snake[i].y) {
        return true;
      }
    }
    return false;
  }

}