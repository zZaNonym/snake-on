const socket = io('/');
let ID = null;
let inputDirections;

const step = 20;
const $gameBoard = document.getElementById('snake-canvas');
const ctx = $gameBoard.getContext('2d');
//Images
const apple = make_base('images/apple.png');

const head_right = make_base('images/head-right.png');
const head_left = make_base('images/head-left.png');
const head_top = make_base('images/head-top.png');
const head_bottom = make_base('images/head-bottom.png');

const tail_right = make_base('images/tail-right.png');
const tail_left = make_base('images/tail-left.png');
const tail_top = make_base('images/tail-top.png');
const tail_bottom = make_base('images/tail-bottom.png');

const body_x = make_base('images/body_x.png');
const body_y = make_base('images/body_y.png');

const turn_right_bottom = make_base('images/turn-left-top.png');
const turn_right_top = make_base('images/turn-left-bottom.png');
const turn_left_bottom = make_base('images/turn-right-top.png');
const turn_left_top = make_base('images/turn-right-bottom.png');

socket.on('player-connected', () => {
  console.log('player connected');
});

socket.on('id', (id) => {
  ID = id;
  if (confirm('Start the game?')) {
    socket.emit('start-game');
  }
});

socket.on('game-started', () => {
  document.addEventListener('keydown', keyPressHandler);
});

socket.on('render', ({ snakesBody, foods }) => {
  draw(snakesBody, foods);
});

socket.on('game-over', (message) => {
  document.removeEventListener('keydown', keyPressHandler);
  if (confirm(message + ' to play again press `OK`')) {
    socket.emit('start-game');
  }
});

function draw(snakesBody, foods) {
  ctx.clearRect(0, 0, 1200, 700);
  drawSnake(snakesBody);
  drawFood(foods);
}

function drawSnake(snakesBody) {
  snakesBody.forEach(({ snakeBody, dir, prevDir }) => {
    snakeBody.forEach(({ x, y }, index) => {
      if (index === 0) {
        const Head = checkHeadDir(dir);
        if (Head) ctx.drawImage(Head, x, y, step, step);
        else {
          ctx.drawImage(checkHeadDir(prevDir), x, y, step, step);
        }
      } else if (index === snakeBody.length - 1) {
        const { x: X, y: Y } = snakeBody[index - 1];

        ctx.drawImage(checkTailDir({ x, y }, { X, Y }), x, y, step, step);
      } else {
        const { x: x1, y: y1 } = snakeBody[index - 1];
        const { x: x2, y: y2 } = snakeBody[index + 1];

        ctx.drawImage(
          checkBodyDir({ x, y }, { X: x1, Y: y1 }, { X: x2, Y: y2 }),
          x,
          y,
          step,
          step
        );
      }
    });
  });
}

function getDirByNext({ x, y }, { X, Y }) {
  if (y < Y) {
    return 'bottom';
  } else if (y > Y) {
    return 'top';
  } else if (x < X) {
    return 'right';
  } else if (x > X) {
    return 'left';
  }
  return '';
}
function checkTailDir(dir1, dir2) {
  const dir = getDirByNext(dir1, dir2);

  if (dir === 'top') {
    return tail_bottom;
  } else if (dir === 'bottom') {
    return tail_top;
  } else if (dir === 'left') {
    return tail_right;
  } else if (dir === 'right') {
    return tail_left;
  }
  return '';
}
function checkHeadDir({ x, y }) {
  if (x == 0 && y === -step) {
    return head_top;
  } else if (x == 0 && y === step) {
    return head_bottom;
  } else if (x == -step && y === 0) {
    return head_left;
  } else if (x == step && y === 0) {
    return head_right;
  }
  return '';
}

function checkBodyDir(dir1, dir2, dir3) {
  const prevDir = getDirByNext(dir1, dir2);
  const nextDir = getDirByNext(dir1, dir3);

  if (
    (prevDir === 'right' && nextDir === 'left') ||
    (prevDir === 'left' && nextDir === 'right')
  ) {
    return body_x;
  } else if (
    (prevDir === 'top' && nextDir === 'bottom') ||
    (prevDir === 'bottom' && nextDir === 'top')
  ) {
    return body_y;
  } else if (
    (prevDir === 'top' && nextDir === 'left') ||
    (prevDir === 'left' && nextDir === 'top')
  ) {
    return turn_left_top;
  } else if (
    (prevDir === 'top' && nextDir === 'right') ||
    (prevDir === 'right' && nextDir === 'top')
  ) {
    return turn_right_top;
  } else if (
    (prevDir === 'left' && nextDir === 'bottom') ||
    (prevDir === 'bottom' && nextDir === 'left')
  ) {
    return turn_left_bottom;
  } else if (
    (prevDir === 'right' && nextDir === 'bottom') ||
    (prevDir === 'bottom' && nextDir === 'right')
  ) {
    return turn_right_bottom;
  }
  return '';
}

function drawFood(foods) {
  foods.forEach(({ x, y }) => {
    ctx.drawImage(apple, x, y, step, step);
  });
}

function keyPressHandler(e) {
  switch (e.code) {
    case 'ArrowUp':
      {
        socket.emit('change-direction', 'ArrowUp');
      }
      break;
    case 'ArrowDown':
      {
        socket.emit('change-direction', 'ArrowDown');
      }
      break;
    case 'ArrowLeft':
      {
        socket.emit('change-direction', 'ArrowLeft');
      }
      break;
    case 'ArrowRight':
      {
        socket.emit('change-direction', 'ArrowRight');
      }
      break;
    case 'KeyP':
      {
        socket.emit('change-direction', 'KeyP');
      }
      break;
  }
}
function make_base(src) {
  let base_image = new Image();
  base_image.src = src;
  return base_image;
}
