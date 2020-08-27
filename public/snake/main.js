const { getSnakeHead, snakeIntersection } = require('./snake');
const { updateFoods, foods } = require('./food');

const { outsidegGrid } = require('./grid');
const { snakes, players, updateSnakes, deletePlayer } = require('./players');

let gameover = false;

function update() {
  updateSnakes();
  updateFoods();
  checkDeath();
}

function checkDeath() {
  snakes.forEach(({ snakeBody }, key) => {
    const { socket } = players[key];

    if (
      outsidegGrid(getSnakeHead(snakeBody)) ||
      snakeIntersection(key, getSnakeHead(snakeBody), snakes)
    ) {
      socket.emit('game-over', 'You lose !');
      deletePlayer(key);
    }
  });
}

function start(io) {
  const game = setInterval(() => {
    if (gameover) clearInterval(game);

    io.in('game').emit('render', {
      snakesBody: snakes.mapToArray(['snakeBody', 'dir']),
      foods,
    });
    update();
  }, 100);

  return game;
}

module.exports = {
  start,
};
