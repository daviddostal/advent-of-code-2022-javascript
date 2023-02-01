const { sum, product } = require("../lib/utils");

const processInput = input => input.trim().replace(/\r\n/g, "\n")
  .split(/\n\n/).map(pair => pair.split("\n").map(JSON.parse));

function compare(left, right) {
  // both sides are integers
  if ([left, right].every(n => typeof (n) === "number"))
    return Math.sign(right - left);

  // if one of the values is an integer, convert it to a list
  const [arr1, arr2] = [left, right].map(a => Array.isArray(a) ? a : [a]);

  // compare list items one by one, return if they are different
  for (let i = 0; i < Math.min(arr1.length, arr2.length); i++) {
    const comparison = compare(arr1[i], arr2[i]);
    if (comparison !== 0) return comparison;
  }

  // if one array runs out of numbers, compare array lengths
  return Math.sign(arr2.length - arr1.length);
}

const part1 = pairs => sum(pairs.map(([left, right], i) =>
  (compare(left, right) > 0) ? (i + 1) : 0
));

const part2 = packets => {
  const dividers = [[[2]], [[6]]];
  const sorted = packets.flat().concat(dividers).sort(compare).reverse();

  return product(dividers.map(divider =>
    1 + sorted.findIndex(packet => compare(packet, divider) === 0)
  ));
};

module.exports = { processInput, part1, part2 };
