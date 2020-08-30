const { step } = require('./grid');

const players = {};
const snakes = new Map([]);

Map.prototype.mapToArray = function (keys = []) {
  const Array = [];

  this.forEach((item, key) =>
    Array.push({ key, ...getSelectedKeys(item, keys) })
  );

  return Array;
};

function getSelectedKeys(obj, keys = []) {
  const newObj = {};

  if (keys.length) {
    keys.forEach(
      (key) => obj[key] && Object.assign(newObj, { [key]: obj[key] })
    );
    return newObj;
  }
  return obj;
}

function pushPlayer(key, data) {
  players[key] = data;
}

function addSegment(key) {
  const { newSegments, snakeBody } = snakes.get(key);

  while (newSegments.nr) {
    snakeBody.push(snakeBody[snakeBody.length - 1]);
    newSegments.nr--;
  }
}

function updateSnakes() {
  snakes.forEach(({ snakeBody, dir: { x, y } }, key) => {
    addSegment(key);

    for (let i = snakeBody.length - 2; i >= 0 && (x !== 0 || y !== 0); i--) {
      snakeBody[i + 1] = { ...snakeBody[i] };
    }

    snakeBody[0].y += y;
    snakeBody[0].x += x;
  });
}

function deletePlayer(key) {
  //delete players[key];
  snakes.delete(key);
}

function changeDirectionHandler(key, dir) {
  const { dir: direction, prevDir } = snakes.get(key);

  switch (dir) {
    case 'ArrowUp':
      {
        if (direction.y !== 0) break;
        direction.x = 0;
        direction.y = -step;
      }
      break;
    case 'ArrowDown':
      {
        if (direction.y !== 0) break;
        direction.x = 0;
        direction.y = step;
      }
      break;
    case 'ArrowLeft':
      {
        if (direction.x !== 0) break;

        direction.x = -step;
        direction.y = 0;
      }
      break;
    case 'ArrowRight':
      {
        if (direction.x !== 0) break;

        direction.x = step;
        direction.y = 0;
      }
      break;
    case 'KeyP':
      {
        direction.x = 0;
        direction.y = 0;
      }
      break;
  }
  if (dir !== 'KeyP') {
    prevDir.x = direction.x;
    prevDir.y = direction.y;
  }
}
module.exports = {
  players,
  addSegment,
  pushPlayer,
  updateSnakes,
  changeDirectionHandler,
  deletePlayer,
  snakes,
};
