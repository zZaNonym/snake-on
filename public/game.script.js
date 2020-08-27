const socket = io('/');
let ID = null;
let inputDirections;
const $gameBoard = document.getElementById('game-board');

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
  $gameBoard.innerHTML = '';
  drawSnake($gameBoard, snakesBody);
  drawFood($gameBoard, foods);
}

function drawSnake(gameBoard, snakesBody) {
  snakesBody.forEach(({ snakeBody, dir }) => {
    snakeBody.forEach(({ x, y }, index) => {
      const snakeElement = document.createElement('div');
      snakeElement.classList.add('snake');

      //===========Snake-tail-head===========
      if (index === 0) {
        const $eyes = document.createElement('img');
        const eyesDir = checkHeadDir(dir);
        $eyes.src = './eyes.png';

        $eyes.classList.add('eyes');
        eyesDir && $eyes.classList.add(eyesDir);

        snakeElement.classList.add('head');
        snakeElement.appendChild($eyes);
      } else if (index === snakeBody.length - 1) {
        const { x: X, y: Y } = snakeBody[index - 1];

        snakeElement.classList.add(checkTailDir({ x, y }, { X, Y }));
      }

      snakeElement.style.gridRowStart = y;
      snakeElement.style.gridColumnStart = x;
      gameBoard.appendChild(snakeElement);
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

function drawFood(gameBoard, foods) {
  foods.forEach((food) => {
    const $food = document.createElement('div');
    $food.classList.add('food');
    $food.style.gridColumnStart = food.x;
    $food.style.gridRowStart = food.y;
    gameBoard.appendChild($food);
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
