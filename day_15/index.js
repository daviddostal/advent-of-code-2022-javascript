const { manhattanDistance, mergeIntervals } = require("../lib/utils");

const processInput = input => input.trim().replace(/\r\n/g, "\n").split("\n")
  .map(row => row.split(": ").map(text => text.split(" at ")[1])
    .map(pos => pos.split(", ").map(coord => parseInt(coord.split("=")[1])))
  );

function sensorRange(sensorPos, beaconPos, row) {
  const beaconDistance = manhattanDistance(sensorPos, beaconPos);
  const rowOffset = Math.abs(row - sensorPos[1]);
  const rangeStart = sensorPos[0] - beaconDistance + rowOffset;
  const rangeEnd = sensorPos[0] + beaconDistance - rowOffset;
  return (rangeStart > rangeEnd) ? null : [rangeStart, rangeEnd];
}

function getCoveredIntervals(devicePositions, row) {
  const coveredIntervals = devicePositions
    .map(([sensor, beacon]) => sensorRange(sensor, beacon, row))
    .filter(interval => interval != null);

  return mergeIntervals(coveredIntervals);
}

function part1(devicePositions, { row = 2_000_000 }) {
  const coveredInterval = getCoveredIntervals(devicePositions, row)[0];

  // A beacon can be the closest for multiple sensorts, therefore we use a Set
  // to count only unique sensor positions (and beacon positions) in the row.
  const deviceCountInRow = new Set(
    devicePositions.flat().filter(([_, y]) => y === row).map(([x, _]) => x)
  ).size

  return (coveredInterval[1] - coveredInterval[0] + 1) - deviceCountInRow;
};

function part2(devicePositions, { coordMax = 4_000_000 }) {
  for (let row = coordMax; row >= 0; row--) {
    const coveredIntervals = getCoveredIntervals(devicePositions, row);

    // If there is more than 1 interval, the beacon is in the gap between them.
    if (coveredIntervals.length > 1) {
      const [gapX, gapY] = [coveredIntervals[0][1] + 1, row];
      const tuningFrequency = gapX * 4_000_000 + gapY;
      return tuningFrequency;
    }
  }
}

const argTypes = { row: "int", maxCoord: "int" };
module.exports = { processInput, part1, part2, argTypes };
