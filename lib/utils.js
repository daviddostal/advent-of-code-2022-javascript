const sum = values => values.reduce((sum, current) => sum + current, 0);

const splitAt = (array, index) => [array.slice(0, index), array.slice(index)];

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

module.exports = { sum, splitAt, intersect, groupBy };
