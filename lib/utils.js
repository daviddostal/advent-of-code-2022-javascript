const sum = values => values.reduce((sum, current) => sum + current, 0);

const count = (arr, predicate) =>
  arr.reduce((count, current) => count + (predicate(current) ? 1 : 0), 0);

const splitAt = (array, index) => [array.slice(0, index), array.slice(index)];

const rotateGrid = grid => grid[0].map((_, col) => grid.map((row) => row[col]).reverse())

function intersect(first, ...other) {
  const otherSets = other.map(x => new Set(x));
  return [...new Set(first)].filter(item => otherSets.every(s => s.has(item)));
}

function groupBy(items, selector) {
  let result = {};
  for (let i = 0; i < items.length; i++) {
    const currentItem = items[i];
    const key = selector(currentItem, i);
    if (result[key] === undefined) result[key] = [];
    result[key].push(currentItem);
  }
  return result;
}

module.exports = { sum, count, splitAt, rotateGrid, intersect, groupBy };
