function onSnakeFoods(snakeBody, foods, updateFood) {
  return snakeBody.some((item) => {
    return foods.some((food, index) => {
      if (equalPosition(item, food)) {
        updateFood(index);
        return true;
      }
      return false;
    });
  });
}
function onSnakesPos(snakesBody, foodPos) {
  let present = false;

  snakesBody.forEach(({ snakeBody }) => {
    present = snakeBody.some((pos) => equalPosition(pos, foodPos));
  });

  return present;
}

function getSnakeHead(snakeBody) {
  return snakeBody[0];
}

function snakeIntersection(KEY, snakeHead, snakes) {
  return snakes.mapToArray(['snakeBody', 'key']).some(({ snakeBody, key }) =>
    snakeBody.some((item, index) => {
      if (KEY === key && index === 0) {
        return false;
      } else if (index === 0 && equalPosition(item, snakeHead)) {
        return Math.floor(Math.random() * 2);
      } else {
        return equalPosition(item, snakeHead);
      }
    })
  );
}

function equalPosition(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

module.exports = {
  onSnakeFoods,
  getSnakeHead,
  snakeIntersection,
  onSnakesPos,
};
