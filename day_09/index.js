const { addVec, subVec } = require("../lib/utils");

const processInput = input => input.trim().replace(/\r\n/g, "\n")
  .split("\n").map(line => line.split(" "))
  .map(([direction, distance]) => ({ direction, distance: parseInt(distance) }));

function follow(previousKnot, currentKnot) {
  const posOffset = subVec(previousKnot, currentKnot);
  return posOffset.some(coord => Math.abs(coord) > 1)
    ? addVec(currentKnot, posOffset.map(Math.sign))
    : currentKnot;
}

function simulateRope(ropeLength, instructions, onMove) {
  const directions = { L: [-1, 0], R: [1, 0], U: [0, 1], D: [0, -1] };

  let rope = Array.from({ length: ropeLength }, _ => [0, 0]);
  instructions.forEach(({ direction, distance }) => {
    for (let i = 0; i < distance; i++) {
      rope[0] = addVec(rope[0], directions[direction]);
      for (let i = 1; i < rope.length; i++)
        rope[i] = follow(rope[i - 1], rope[i]);

      onMove(rope);
    }
  });
}

function positionsVisitedByTail(ropeLength, instructions) {
  let visitedPositions = new Set();
  simulateRope(ropeLength, instructions, rope => visitedPositions.add(rope.at(-1).join(";")));
  return visitedPositions;
}

const part1 = moves => positionsVisitedByTail(2, moves).size;
const part2 = moves => positionsVisitedByTail(10, moves).size;

module.exports = { processInput, part1, part2 };