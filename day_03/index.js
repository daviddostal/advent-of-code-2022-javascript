const { sum, splitAt, intersect, groupBy } = require("../lib/utils");

const processInput = input => input.trim().replace(/\r\n/g, "\n").split("\n");

const priority = letter =>
  letter.charCodeAt() - (letter === letter.toUpperCase() ? 38 : 96);

const part1 = rucksacks => sum(
  rucksacks.map(items => splitAt(items, items.length / 2))
    .map(pockets => intersect(...pockets)[0])
    .map(priority)
);

const part2 = rucksacks => sum(
  Object.values(groupBy(rucksacks, (_, i) => Math.floor(i / 3)))
    .map(rucksacks => intersect(...rucksacks)[0])
    .map(priority)
);

module.exports = { processInput, part1, part2 };
