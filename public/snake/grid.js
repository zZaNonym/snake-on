const GRID_SIZE_X = 60;
const GRID_SIZE_Y = 35;

function randomGridPosition() {
  return {
    x: Math.floor(Math.random() * GRID_SIZE_X) + 1,
    y: Math.floor(Math.random() * GRID_SIZE_Y) + 1,
  };
}

function outsidegGrid({ x, y }) {
  return x > GRID_SIZE_X || x < 1 || y > GRID_SIZE_Y || y < 1;
}

module.exports = {
  randomGridPosition,
  outsidegGrid,
};
