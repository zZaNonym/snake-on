const socket = io('/');
let ID = null;
let inputDirections;
const step = 20;
const $gameBoard = document.getElementById('snake-canvas');
const ctx = $gameBoard.getContext('2d');

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
  snakesBody.forEach(({ snakeBody, dir }) => {
    snakeBody.forEach(({ x, y }, index) => {
      ctx.fillStyle = 'blue';
      ctx.fillRect(x, y, step, step);
    });
  });
}

function checkTailDir({ x, y }, { X, Y }) {
  if (y < Y) {
    return 'tail-top';
  } else if (y > Y) {
    return 'tail-bottom';
  } else if (x < X) {
    return 'tail-left';
  } else if (x > X) {
    return 'tail-right';
  }
  return '';
}
function checkHeadDir({ x, y }) {
  if (x == 0 && y === -1) {
    return 'eyes-top';
  } else if (x == -1 && y === 0) {
    return 'eyes-left';
  } else if (x == 1 && y === 0) {
    return 'eyes-right';
  }
  return '';
}

function drawFood(foods) {
  foods.forEach(({ x, y }) => {
    ctx.fillStyle = 'red';
    ctx.fillRect(x, y, step, step);
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
    // case 'KeyP':
    //   {
    //     socket.emit('change-direction', 'KeyP');
    //   }
    //   break;
  }
}
