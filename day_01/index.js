const { sum } = require("../lib/utils");

const processInput = input => input.trim().replace(/\r\n/g, "\n").split(/\n\n/)
  .map(snacks => snacks.split("\n").map(calories => parseInt(calories)));

const part1 = elfSnacks => Math.max(...elfSnacks.map(sum));
const part2 = elfSnacks => sum(elfSnacks.map(sum).sort((a, b) => a - b).slice(-3));

module.exports = { processInput, part1, part2 };
