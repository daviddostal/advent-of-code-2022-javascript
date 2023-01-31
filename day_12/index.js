const { BFS } = require("../lib/utils");

const processInput = input => input.trim().replace(/\r\n/g, "\n")
  .split("\n").map(line => line.split(""));

function findPosition(grid, char) {
  for (const [y, row] of grid.entries())
    for (const [x, value] of row.entries())
      if (value === char) return [x, y];
}

const isInsideGrid = (grid, [x, y]) =>
  (x >= 0) && (x <= grid[0].length - 1) && (y >= 0) && (y <= grid.length - 1);

const neighborPositions = (grid, [x, y]) =>
  [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]
    .filter(neighbor => isInsideGrid(grid, neighbor));

const posToString = pos => pos.join(";");

function findDistance(grid, start, end, isWalkable) {
  const startPosition = findPosition(grid, start);
  const distances = { [posToString(startPosition)]: 0 };

  const targetPosition = BFS({
    start: startPosition,
    neighbors: pos => neighborPositions(grid, pos)
      .filter(neighbor => isWalkable(pos, neighbor)),
    stateToKey: posToString,
    isEnd: ([x, y]) => grid[y][x] === end,
    onVisit: (pos, parent) =>
      distances[posToString(pos)] = distances[posToString(parent)] + 1,
  });

  return distances[posToString(targetPosition)];
}

const heightAt = (grid, [x, y]) => "SabcdefghijklmnopqrstuvwxyzE".indexOf(grid[y][x]);

const part1 = heightMap => findDistance(heightMap, "S", "E", (pos, neighbor) =>
  heightAt(heightMap, neighbor) - heightAt(heightMap, pos) <= 1
);

const part2 = heightMap => findDistance(heightMap, "E", "a", (pos, neighbor) =>
  heightAt(heightMap, pos) - heightAt(heightMap, neighbor) <= 1
);

module.exports = { processInput, part1, part2 };
