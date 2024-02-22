const { BFS, lcm, addVec } = require("../lib/utils");

const directions = { ">": [1, 0], "v": [0, 1], "<": [-1, 0], "^": [0, -1] };

function findBlizzards(parsedInput) {
  let blizzards = [];
  parsedInput.forEach((line, y) =>
    line.forEach((char, x) => {
      if (char !== ".")
        blizzards.push({ pos: [x, y], dir: directions[char] });
    })
  );
  return blizzards;
}

const wrap = (coord, size) => ((coord % size) + size) % size;
const posToKey = ([x, y]) => `${x};${y}`;

function blizzardPositions({ blizzards, width, height }, time) {
  return Object.fromEntries(blizzards.map(({ pos, dir }) => {
    const blizzardPos = [
      wrap(pos[0] + time * dir[0], width),
      wrap(pos[1] + time * dir[1], height),
    ];
    return [posToKey(blizzardPos), blizzardPos];
  }));
}

function precomputeBlizzards({ blizzards, width, height }) {
  const blizzardsRepetitionInterval = lcm(width, height);
  const computedBlizzardPositions = [];
  for (let i = 0; i < blizzardsRepetitionInterval; i++) {
    computedBlizzardPositions.push(blizzardPositions({ blizzards, width, height }, i));
  }

  return function isBlizzard(time, position) {
    const blizzards = computedBlizzardPositions[time % blizzardsRepetitionInterval]
    return blizzards[posToKey(position)] !== undefined;
  }
}

function processInput(input) {
  const parsedInput = input.trim().replace(/\r\n/g, "\n")
    .split("\n")
    .slice(1, -1)
    .map(line => line.slice(1, -1).split(""));

  const [width, height] = [parsedInput[0].length, parsedInput.length];
  const blizzards = findBlizzards(parsedInput);
  const isBlizzard = precomputeBlizzards({ blizzards, width, height });
  return { isBlizzard, width, height };
}

function pathLength(parsedMap, startPos, endPos, startTime = 0) {
  const neighborDirections = [[0, 0], ...Object.values(directions)];

  const isInsideMap = ([x, y]) =>
    (x >= 0 && x < parsedMap.width && y >= 0 && y < parsedMap.height) ||
    [startPos, endPos].some(allowedPos => posToKey([x, y]) === posToKey(allowedPos));

  function neighbors({ pos, time }) {
    const allNeighbors = neighborDirections.map(dir => addVec(pos, dir));
    const validNeighbors = allNeighbors.filter(neighborPos =>
      isInsideMap(neighborPos) &&
      !parsedMap.isBlizzard(time, neighborPos)
    );
    return validNeighbors.map(pos => ({ pos, time: time + 1 }));
  }

  const { time: endTime } = BFS({
    start: { pos: startPos, time: startTime },
    neighbors,
    stateToKey: ({ pos, time }) => `${time}:${posToKey(pos)}`,
    isEnd: ({ pos }) => posToKey(pos) === posToKey(endPos),
  });

  return endTime - 1;
}

function part1(parsedMap) {
  const [startPos, endPos] = [[0, -1], [parsedMap.width - 1, parsedMap.height]];
  return pathLength(parsedMap, startPos, endPos);
}

function part2(parsedMap) {
  const [startPos, endPos] = [[0, -1], [parsedMap.width - 1, parsedMap.height]];
  const time1 = pathLength(parsedMap, startPos, endPos);
  const time2 = pathLength(parsedMap, endPos, startPos, time1);
  const time3 = pathLength(parsedMap, startPos, endPos, time2);
  return time3;
};

module.exports = { processInput, part1, part2 };
