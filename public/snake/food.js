const { randomGridPosition } = require('./grid');
const { snakes } = require('./players');

const { onSnakeFoods, onSnakesPos } = require('./snake');

let foods = [
  getRandomFoodPosition(),
  getRandomFoodPosition(),
  getRandomFoodPosition(),
];
const EXTENSION_RATE = 1;

function updateFoods() {
  snakes.forEach(({ snakeBody }, key) => {
    if (onSnakeFoods(snakeBody, foods, updateFood)) {
      snakes.get(key).newSegments.nr += EXTENSION_RATE;
    }
  });
}

function getRandomFoodPosition() {
  let newPosition;
  while (newPosition == null || onSnakesPos(snakes, newPosition)) {
    newPosition = randomGridPosition();
  }

  return newPosition;
}

function updateFood(key) {
  foods[key] = getRandomFoodPosition();
}

module.exports = {
  updateFoods,
  foods,
  getRandomFoodPosition,
};
