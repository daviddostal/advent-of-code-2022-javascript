const { rangeBetween } = require("../lib/utils");

const processInput = input => input.trim().replace(/\r\n/g, "\n").split("\n")
  .map(line => line.split(" -> ").map(
    pos => pos.split(",").map(coord => parseInt(coord)))
  );

// Note: Doesn't work for diagonal lines.
// The puzzle only uses horizontal and vertical lines.
const linePositions = ([x1, y1], [x2, y2]) =>
  rangeBetween(x1, x2).flatMap(x => rangeBetween(y1, y2).map(y => [x, y]));

const wallPositions = wall => wall.slice(0, -1).flatMap(
  (pos, i) => linePositions(pos, wall[i + 1])
)

const drawWalls = (grid, walls) => walls.forEach(wall =>
  wallPositions(wall).forEach(([x, y]) => grid[y][x] = "#")
)

const fall = (grid, [x, y]) => [
  [x, y + 1], // down
  [x - 1, y + 1], // down left
  [x + 1, y + 1], // down right
  [x, y], // current
].find(([x, y]) => grid[y][x] === undefined);

function dropSand(grid, sandPos, shouldStop, isFloor) {
  while (true) {
    const nextPos = fall(grid, sandPos);
    if (shouldStop(nextPos, grid)) return false;

    if (nextPos.every((coord, i) => coord === sandPos[i]) || isFloor(nextPos, grid)) {
      grid[nextPos[1]][nextPos[0]] = "o";
      return nextPos;
    }
    sandPos = nextPos;
  }
}

function runSimulation(walls, shouldStop, isFloor = () => false) {
  const yMax = Math.max(...walls.flat().map(([_x, y]) => y)) + 1;
  let grid = Array(yMax + 1).fill().map(_ => []);
  drawWalls(grid, walls);

  let sandCount = 0;
  while (dropSand(grid, [500, 0], shouldStop, isFloor))
    sandCount++;

  return sandCount;
}

const part1 = walls => runSimulation(walls,
  ([_x, y], grid) => y >= grid.length - 1
);

const part2 = walls => runSimulation(walls,
  pos => pos === undefined,
  ([_x, y], grid) => y >= grid.length - 1,
);

module.exports = { processInput, part1, part2 };
