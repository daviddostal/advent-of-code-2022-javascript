const { windowed } = require("../lib/utils");

const processInput = input => input.trim();

const findStartMarker = size => chars =>
  windowed(chars, size).findIndex(chars => new Set(chars).size === size) + size

const part1 = findStartMarker(4);
const part2 = findStartMarker(14);

module.exports = { processInput, part1, part2 }