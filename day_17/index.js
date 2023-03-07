const fs = require("fs");
const path = require("path");
const { BFS, addVec } = require("../lib/utils");

function parseRockShape(shape) {
  const rows = shape.split("\n");
  const [width, height] = [rows[0].length, rows.length];

  const positions = [];
  for (let row = 0; row < height; row++)
    for (let col = 0; col < width; col++)
      if (rows[height - row - 1][col] === "#")
        positions.push([col, row]);

  return { positions, origin: [0, 0], size: [width, height] };
}

function processInput(input) {
  const windDirections = input.trim().replace(/\r\n/g, "\n").split("");
  const rockShapesPath = path.resolve(__dirname, "rock_shapes.txt");
  const rockShapes = fs.readFileSync(rockShapesPath, "utf8")
    .trim().replace(/\r\n/g, "\n").split("\n\n").map(parseRockShape);
  return { windDirections, rockShapes };
}

// Move a rock in the given direction.
function moveRock({ positions, origin, size }, direction) {
  return {
    positions: positions.map(pos => addVec(pos, direction)),
    origin: addVec(origin, direction),
    size,
  }
}

// CHeck if the rock is in a valid position.
function canMoveTo({ positions, origin, size }, grid) {
  return (
    origin[1] >= 0 && // is above ground
    origin[0] >= 0 && // is not outside left wall
    origin[0] + size[0] - 1 < 7 && // is not outside right wall
    // does not collide with filled positions on grid
    positions.every(pos => !isFilled(grid, pos))
  )
}

// Check if a position in the grid is already filled.
function isFilled(grid, [x, y]) {
  return isInsideGrid(grid, [x, y]) && grid[y][x]
}

// Check if a position is inside the bounds of the grid.
function isInsideGrid(grid, [x, y]) {
  const height = grid.length;
  const width = height > 0 ? grid[0].length : 0;
  return (y <= height - 1 && y >= 0 && x >= 0 && x <= width - 1);
}

// Move the rock in the wind direction, if there are no obstacles.
function applyWind(rock, grid, windDirection) {
  const direction = ({ ">": [1, 0], "<": [-1, 0] })[windDirection];
  const newRock = moveRock(rock, direction);
  return canMoveTo(newRock, grid) ? newRock : rock;
}

// Move the rock one step down, if possible.
function fall(rock, grid) {
  const newRock = moveRock(rock, [0, -1]);
  const canFall = canMoveTo(newRock, grid);
  return [canFall ? newRock : rock, canFall];
}

// Simulate a rock falling and being pushed around by wind, until it comes
// to rest, then permanently add it to the grid.
function dropRock(grid, shape, windDirections, windIndex) {
  let currentWindIndex = windIndex % windDirections.length;
  let currentRock = moveRock(shape, [2, grid.length + 3]);
  let isFalling = true;
  while (isFalling) {
    const windDir = windDirections[currentWindIndex % windDirections.length];
    const afterWind = applyWind(currentRock, grid, windDir);
    [currentRock, isFalling] = fall(afterWind, grid);
    currentWindIndex = (currentWindIndex + 1) % windDirections.length;
  }
  const newGrid = placeRock(grid, currentRock);
  return { newGrid, newWindIndex: currentWindIndex };
}

// Add a rock, which will not move anymore to the tower of already fallen rocks.
function placeRock(grid, { positions, origin, size }) {
  const heightDiff = Math.max(0, origin[1] + size[1] - grid.length);
  grid.push(...Array(heightDiff).fill().map(_ => Array(7).fill(false)));

  positions.forEach(([x, y]) => grid[y][x] = true);
  return grid;
}

// Run the simulation of repeatedly dropping rocks onto the tower.
// Every time a rock comes to rest, 'onRockPlaced' gets called with information
// about the current state of the simulation. If 'onRockPlaced' returns 'true',
// the simulation ends.
function runSimulation(shapes, windDirections, onRockPlaced) {
  let [grid, roundNumber, windIndex] = [[], 0, 0];
  let shouldStop = false;
  while (!shouldStop) {
    const { newGrid, newWindIndex } = dropRock(
      grid, shapes[roundNumber % shapes.length], windDirections, windIndex
    );
    shouldStop = onRockPlaced(roundNumber, newGrid, newWindIndex);
    grid = newGrid;
    windIndex = newWindIndex;
    roundNumber++;
  }
  return grid;
}

function part1({ windDirections, rockShapes }) {
  return runSimulation(
    rockShapes, windDirections, round => (round + 1) >= 2022
  ).length;
}

// Get a set of all empty positions reachable from the top of the grid, where a
// falling shape could theoretically land.
function reachablePositions(grid) {
  const searchDirections = [[1, 0], [-1, 0], [0, 1]];
  const [width, height] = [grid[0].length, grid.length];
  const posToString = ([x, y]) => `${x};${y}`;

  const foudPositions = new Set();
  for (let col = 0; col < width; col++) {
    BFS({
      start: [col, 0],
      neighbors: pos =>
        searchDirections.map(dir => addVec(pos, dir)).filter(([nX, nY]) =>
          isInsideGrid(grid, [nX, nY]) && !isFilled(grid, [nX, height - nY - 1])
        ),
      stateToKey: posToString,
      onVisit: (pos) => foudPositions.add(posToString(pos)),
    });
  }
  return foudPositions;
}

// Finds the point, where the shape of the tower starts repeating end return
// information about the found cycle, such as start and end round of the cycle,
// its length in rounds, the height of the tower before the cycle begins and the
// height of the repeating part of the tower.
function findRepetition(shapes, windDirections) {
  let [heights, seenStates] = [[], []];
  runSimulation(shapes, windDirections, (round, newGrid, newWindIndex) => {
    // When the combination of rock shape, wind index and the shape of empty
    // positions reachable from the top matches one already seen before, then
    // the shape of the tower has to start repeating.
    const currentState =
      `rock:${round % shapes.length};` +
      `wind:${newWindIndex};` +
      `reachable:${[...reachablePositions(newGrid)].sort().join("|")}}]`;
    const shouldStop = seenStates.includes(currentState);
    seenStates.push(currentState);
    heights.push(newGrid.length);
    return shouldStop;
  });

  const cycleStart = seenStates.indexOf(seenStates.at(-1));
  const cycleEnd = seenStates.length - 2;
  const cycleLength = cycleEnd - cycleStart + 1;
  const heightBeforeCycle = heights[cycleStart - 1];
  const cycleHeight = heights[cycleEnd] - heights[cycleStart - 1];

  return { cycleStart, cycleLength, cycleHeight, heightBeforeCycle, heights };
}

function part2({ windDirections, rockShapes }) {
  const { cycleStart, cycleLength, cycleHeight, heightBeforeCycle, heights } =
    findRepetition(rockShapes, windDirections);

  const totalIterations = 1_000_000_000_000;
  const iterationsAfterCycle = (totalIterations - cycleStart) % cycleLength;
  const heightAfterCycle = heights[cycleStart + iterationsAfterCycle - 1] - heightBeforeCycle;
  const cycleCount = (totalIterations - cycleStart - iterationsAfterCycle) / cycleLength;
  const totalHeight = heightBeforeCycle + heightAfterCycle + cycleHeight * cycleCount;
  return totalHeight;
}

module.exports = { processInput, part1, part2 };
