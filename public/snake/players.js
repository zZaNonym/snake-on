const snake = require('./snake');

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
  snakes.forEach(({ snakeBody, dir }, key) => {
    addSegment(key);
    for (let i = snakeBody.length - 2; i >= 0; i--) {
      snakeBody[i + 1] = { ...snakeBody[i] };
    }
    snakeBody[0].y += dir.y;
    snakeBody[0].x += dir.x;
  });
}

function deletePlayer(key) {
  //delete players[key];
  snakes.delete(key);
}

function changeDirectionHandler(key, dir) {
  const { dir: direction } = snakes.get(key);

  switch (dir) {
    case 'ArrowUp':
      {
        if (direction.y !== 0) break;
        direction.x = 0;
        direction.y = -1;
      }
      break;
    case 'ArrowDown':
      {
        if (direction.y !== 0) break;
        direction.x = 0;
        direction.y = 1;
      }
      break;
    case 'ArrowLeft':
      {
        if (direction.x !== 0) break;

        direction.x = -1;
        direction.y = 0;
      }
      break;
    case 'ArrowRight':
      {
        if (direction.x !== 0) break;

        direction.x = 1;
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