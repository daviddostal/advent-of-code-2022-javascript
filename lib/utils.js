const sum = values => values.reduce((sum, current) => sum + current, 0);
const product = values => values.reduce((sum, current) => sum * current, 1);

const count = (arr, predicate) =>
  arr.reduce((count, current) => count + (predicate(current) ? 1 : 0), 0);

function rangeBetween(start, end, options) {
  const { step, includeEnd } = { step: 1, includeEnd: true, ...options };
  const length = Math.ceil((Math.abs(end - start) + (includeEnd ? 1 : 0)) / step);
  const direction = (end > start) ? 1 : -1;
  return Array.from({ length }, (_, i) => start + direction * i * step);
}

function range(length, options) {
  return rangeBetween(0, length, { includeEnd: false, ...options });
}

const windowed = (array, windowSize) =>
  range(array.length - windowSize + 1).map(i => array.slice(i, i + windowSize));

const chunk = (items, size) => Object.values(groupBy(items, (_, i) => Math.floor(i / size)));

const wrapNum = (n, length) => ((n % length) + length) % length;

const splitAt = (array, index) => [array.slice(0, index), array.slice(index)];

const rotateGrid = grid => grid[0].map((_, col) => grid.map((row) => row[col]).reverse())

function intersect(first, ...other) {
  const otherSets = other.map(x => new Set(x));
  return [...new Set(first)].filter(item => otherSets.every(s => s.has(item)));
}

function mergeIntervals(intervals) {
  const sorted = intervals.sort((i1, i2) => i1[0] - i2[0]);
  let result = [sorted[0].slice()];
  for (let [from, to] of sorted.slice(1)) {
    if ((from - 1) <= result.at(-1)[1])
      result.at(-1)[1] = Math.max(to, result.at(-1)[1]);
    else
      result.push([from, to]);
  }
  return result;
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

function countBy(array, selector = item => item) {
  const occurrenceCounts = new Map();
  for (let item of array) {
    if (!occurrenceCounts.has(selector(item)))
      occurrenceCounts.set(selector(item), 0);
    const currentCount = occurrenceCounts.get(selector(item));
    occurrenceCounts.set(selector(item), currentCount + 1);
  }
  return occurrenceCounts;
}

const findIndexBy = compare => function findIndexBy(array, selector) {
  let [currentIndex, currentValue] = [0, selector(array[0])];
  for (let i = 1; i < array.length; i++) {
    const value = selector(array[i]);
    if (compare(value, currentValue)) {
      currentValue = value;
      currentIndex = i;
    }
  }
  return currentIndex;
}
const maxIndexBy = findIndexBy((a, b) => a > b);
const minIndexBy = findIndexBy((a, b) => a < b);
const maxBy = (array, selector) => array[maxIndexBy(array, selector)];
const minBy = (array, selector) => array[minIndexBy(array, selector)];

const addVec = (v1, v2) => v1.map((coord, i) => coord + v2[i]);
const subVec = (v1, v2) => v1.map((coord, i) => coord - v2[i]);

const manhattanDistance = (pos1, pos2) => sum(subVec(pos1, pos2).map(Math.abs));

function BFS({ start, neighbors, ...optionalParams }) {
  const { stateToKey, isEnd, onVisit } = {
    stateToKey: s => s, isEnd: () => false, onVisit: () => { },
    ...optionalParams
  };

  let seen = new Set([stateToKey(start)]);
  let toVisitQueue = [start];

  while (toVisitQueue.length > 0) {
    const currentPos = toVisitQueue.pop();

    if (isEnd(currentPos)) return currentPos;

    const newNeighbors = neighbors(currentPos).filter(n => !(seen.has(stateToKey(n))));
    newNeighbors.forEach(n => {
      onVisit(n, currentPos);
      seen.add(stateToKey(n));
    });

    toVisitQueue = newNeighbors.concat(toVisitQueue);
  }
}

function DFS({ start, neighbors, ...optionalParams }) {
  const { stateToKey, isEnd, onVisit } = {
    stateToKey: s => s, isEnd: () => false, onVisit: () => { },
    ...optionalParams
  };

  let seen = new Set([stateToKey(start)]);
  let toVisitStack = [start];

  while (toVisitStack.length > 0) {
    const currentPos = toVisitStack.pop();

    if (isEnd(currentPos)) return currentPos;

    const newNeighbors = neighbors(currentPos).filter(n => !(seen.has(stateToKey(n))));
    newNeighbors.forEach(n => {
      onVisit(n, currentPos);
      seen.add(stateToKey(n));
    });

    toVisitStack.push(...newNeighbors);
  }
}

module.exports = {
  sum, product, count, range, rangeBetween, windowed, chunk, wrapNum, splitAt,
  rotateGrid, intersect, mergeIntervals, groupBy, countBy, maxIndexBy, minIndexBy,
  maxBy, minBy, addVec, subVec, manhattanDistance, BFS, DFS
};
