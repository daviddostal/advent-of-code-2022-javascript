const { range, count } = require("../lib/utils");

const processInput = input => input.trim().replace(/\r\n/g, "\n").split("\n")
  .map(line => line.split("").map(n => parseInt(n)));

function traverseGrid(grid, callback) {
  const [width, height] = [grid[0].length, grid.length];
  // left to right
  range(height).forEach(row => callback(range(width).map(col => [col, row])));
  // right to left
  range(height).forEach(row => callback(range(width).map(col => [col, row]).reverse()));
  // top to bottom
  range(width).forEach(col => callback(range(height).map(row => [col, row])));
  // bottom to top
  range(width).forEach(col => callback(range(height).map(row => [col, row]).reverse()));
}

function part1(grid) {
  const [width, height] = [grid[0].length, grid.length];
  const visibilities = range(height).map(_ => Array(width).fill(false));

  traverseGrid(grid, lineCoords => {
    let maxHeight = -1;
    lineCoords.forEach(([col, row]) => {
      const currentHeight = grid[row][col];
      if (currentHeight > maxHeight) {
        visibilities[row][col] = true;
        maxHeight = currentHeight;
      }
    });
  });

  return count(visibilities.flat(), isVisible => isVisible);
}

function part2(grid) {
  const [width, height] = [grid[0].length, grid.length];
  const scenicScores = range(height).map(_ => Array(width).fill(1));

  traverseGrid(grid, lineCoords => {
    lineCoords.forEach(([col, row], i) => {
      let viewingDistance = 0;
      for (let [nextCol, nextRow] of lineCoords.slice(i + 1)) {
        viewingDistance++;
        if (grid[nextRow][nextCol] >= grid[row][col])
          break;
      }
      scenicScores[row][col] *= viewingDistance;
    })
  });

  return Math.max(...scenicScores.flat());
}

module.exports = { processInput, part1, part2 };
