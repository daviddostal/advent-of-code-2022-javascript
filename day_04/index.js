const { count } = require("../lib/utils");

const processInput = input => input
  .trim().replace(/\r\n/g, "\n").split("\n")
  .map(line => line.split(",")
    .map(range => range.split("-").map(num => parseInt(num)))
  );

const isSubInterval = (i1, i2) => ((i1[0] <= i2[0]) && (i1[1] >= i2[1]));

const part1 = assignments => count(assignments, ([i1, i2]) =>
  isSubInterval(i1, i2) || isSubInterval(i2, i1)
);

const intervalsOverlap = (i1, i2) => (i1[1] >= i2[0]) && (i1[0] <= i2[1]);

const part2 = assignments => count(assignments, ([i1, i2]) =>
  intervalsOverlap(i1, i2)
);

module.exports = { processInput, part1, part2 };
