const { countBy, addVec } = require("../lib/utils");

function processInput(input) {
  const parsedGrid = input.trim().replace(/\r\n/g, "\n").split("\n")
    .map(row => row.split(""));

  return new Set(parsedGrid
    .flatMap((row, y) => row.map((value, x) =>
      value === "#" ? `${x};${y}` : undefined
    )).filter(pos => pos !== undefined)
  );
}

const directions = {
  nw: [-1, -1], n: [0, -1], ne: [1, -1], e: [1, 0],
  se: [1, 1], s: [0, 1], sw: [-1, 1], w: [-1, 0],
}

const neighborDirections = Object.fromEntries(Object.entries({
  n: ["n", "ne", "nw"], s: ["s", "se", "sw"],
  w: ["w", "nw", "sw"], e: ["e", "ne", "se"],
}).map(([dir, neighbors]) => [dir, neighbors.map(n => directions[n])]))

function neighborsInDirection([x, y], direction) {
  return neighborDirections[direction].map(([dx, dy]) => [x + dx, y + dy]);
}

const neighbors = pos => Object.values(directions).map(dir => addVec(pos, dir));

function rotate(array, offset) {
  offset %= array.length;
  return [...array.slice(offset), ...array.slice(0, offset)];
}

const posToKey = ([x, y]) => `${x};${y}`;
const keyToPos = str => str.split(";").map(coord => parseInt(coord));

function proposeMoves(elfPositions, directionsToLook) {
  return Object.fromEntries([...elfPositions]
    .map((key) => {
      const pos = keyToPos(key)
      // if elf has no neighbors, he doesn't move
      if (neighbors(pos).every(n => !elfPositions.has(posToKey(n))))
        return [key, null];

      // find first direction, where all neighbors in direction are empty
      const moveDirection = directions[directionsToLook.find(dir =>
        neighborsInDirection(pos, dir).every(pos => !elfPositions.has(posToKey(pos)))
      )];

      // if all directions are occupied return original position, else move in empty direction
      return (moveDirection === undefined)
        ? [key, null] : [key, [pos[0] + moveDirection[0], pos[1] + moveDirection[1]]];
    })
    .filter(([key, moveTo]) => moveTo !== null)
  );
}

function makeMoves(currentPositions, moves) {
  return new Set([...currentPositions].map(key =>
    (moves[key] === undefined) ? key : posToKey(moves[key])
  ));
}

function findBounds(positions) {
  let [[xMin, yMin], [xMax, yMax]] = [positions[0], positions[0]];
  positions.slice(1).forEach(([x, y]) => {
    ([xMin, yMin, xMax, yMax] = [
      Math.min(xMin, x), Math.min(yMin, y), Math.max(xMax, x), Math.max(yMax, y)
    ]);
  });
  return { xMin, yMin, xMax, yMax };
}

function runSimulation(elfPositions, shouldStop) {
  const searchDirections = ["n", "s", "w", "e"];
  let currentPositions = elfPositions;

  for (let round = 1; ; round++) {

    // get proposed moves
    const proposedMoves = proposeMoves(currentPositions, rotate(searchDirections, round - 1));
    const occurrenceCounts = countBy(Object.values(proposedMoves).map(posToKey));

    // remove proposed moves, that have a duplicate
    const validMoves = Object.fromEntries(Object.entries(proposedMoves).filter(
      ([_from, toPos]) => occurrenceCounts.get(posToKey(toPos)) === 1
    ));

    if (shouldStop({ round, moves: validMoves }))
      return { round, positions: currentPositions };

    // update grid according to moves
    currentPositions = makeMoves(currentPositions, validMoves);
  }
}

function part1(elfPositions) {
  const { positions } = runSimulation(elfPositions, ({ round }) => round > 10);

  const bounds = findBounds([...positions].map(keyToPos));
  const size = Math.abs(bounds.xMax - bounds.xMin + 1) * Math.abs(bounds.yMax - bounds.yMin + 1);
  return size - positions.size;
}

function part2(elfPositions) {
  return runSimulation(elfPositions, ({ moves }) =>
    Object.keys(moves).length === 0
  ).round;
}

module.exports = { processInput, part1, part2 };
