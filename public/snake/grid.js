const GRID_SIZE_X = 1200;
const GRID_SIZE_Y = 700;
const step = 20;

function randomGridPosition() {
  return {
    x: Math.floor(Math.random() * (GRID_SIZE_X / step)) * step - step,
    y: Math.floor(Math.random() * (GRID_SIZE_Y / step)) * step - step,
  };
}

function outsidegGrid({ x, y }) {
  return x > GRID_SIZE_X || x < 0 || y > GRID_SIZE_Y || y < 0;
}

module.exports = {
  randomGridPosition,
  outsidegGrid,
  step,
};
