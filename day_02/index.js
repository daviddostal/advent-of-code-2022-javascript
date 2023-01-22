const { sum } = require("../lib/utils");

const processInput = input => input.trim().replace(/\r\n/g, "\n").split("\n")
  .map(moves => moves.replace(" ", ""));

const getTotalScore = (moves, moveScores) => sum(moves.map(move => moveScores[move]));

const part1 = moves => getTotalScore(moves, {
  AX: 4, AY: 8, AZ: 3,
  BX: 1, BY: 5, BZ: 9,
  CX: 7, CY: 2, CZ: 6,
});

const part2 = moves => getTotalScore(moves, {
  AX: 3, AY: 4, AZ: 8,
  BX: 1, BY: 5, BZ: 9,
  CX: 2, CY: 6, CZ: 7,
});

module.exports = { processInput, part1, part2 };
