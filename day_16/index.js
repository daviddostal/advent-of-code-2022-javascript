const { BFS, DFS, sum, maxIndexBy } = require("../lib/utils");

function calculateDistances(valves) {
  const distances = {};
  for (let currentValve of Object.keys(valves)) {
    const distancesToValve = { [currentValve]: 0 }
    BFS({
      start: currentValve,
      neighbors: valve => valves[valve].neighbors,
      onVisit: (valve, parent) =>
        distancesToValve[valve] = distancesToValve[parent] + 1,
    })
    distances[currentValve] = distancesToValve;
  }
  return distances;
}

function processInput(input) {
  const valves = Object.fromEntries(
    input.trim().replace(/\r\n/g, "\n").split("\n")
      .map(line => line.match(/^Valve (?<name>\w{2}) has flow rate=(?<flowRate>\d+); tunnels? leads? to valves? (?<tunnels>\w{2}(?:, \w{2})*)$/).groups)
      .map(({ name, flowRate, tunnels }) => [name, {
        flowRate: parseInt(flowRate),
        neighbors: tunnels.split(", "),
      }])
  );
  const nonZeroValves = Object.keys(valves).filter(v => valves[v].flowRate > 0);
  const distances = calculateDistances(valves);
  return { valves, nonZeroValves, distances };
}

function pathScore({ distances, valves }, path, remainingTime) {
  let score = 0;
  for (let i = 1; i < path.length; i++) {
    const [previousValve, currentValve] = [path[i - 1], path[i]];
    const timeToOpen = distances[previousValve][currentValve] + 1;
    score += valves[currentValve].flowRate * (remainingTime - timeToOpen);
    remainingTime -= timeToOpen;
  }
  return score;
}

function validMoves({ nonZeroValves, distances }, playerStates) {
  const playerIndex = maxIndexBy(playerStates, p => p.remainingTime);
  const { pos, path, remainingTime } = playerStates[playerIndex];

  const valvesToOpen = nonZeroValves.filter(valve =>
    !playerStates.some(({ path }) => path.includes(valve)) &&
    (remainingTime - distances[pos][valve] - 1 >= 1)
  );

  return valvesToOpen.map(valve => {
    const newPlayerStates = [...playerStates];
    newPlayerStates[playerIndex] = {
      pos: valve,
      path: [...path, valve],
      remainingTime: remainingTime - distances[pos][valve] - 1,
    };
    return newPlayerStates;
  });
}

// Calculates the maximum pressure, that can possibly be released, assuming an
// optimal arrangement of valves, where every valve with nonzero pressure is
// directly connected by a tunnel.
//
// In this best-case scenario, every "player" (human, elephant) can always open
// any of the remaining closed valves in 2 seconds (1 second for moving to the
// next valve and 1 second for opening it).
//
// Assuming the time to get to any valve is the same, the optimal strategy is to
// always open the valves with the most pressure first.
function scoreUpperBound({ valves, nonZeroValves, distances },
  playerStates, initialTime
) {
  const valvesToOpen = nonZeroValves
    .filter(v => playerStates.every(({ path }) => !path.includes(v)))
    .sort((v1, v2) => valves[v1].flowRate - valves[v2].flowRate);

  let score = sum(playerStates.map(({ path }) =>
    pathScore({ distances, valves }, path, initialTime))
  );

  const highestTime = Math.max(...playerStates.map(p => p.remainingTime));
  for (let remainingTime = highestTime; remainingTime > 0; remainingTime -= 2) {
    for (let { remainingTime: playerTime } of playerStates) {
      if (playerTime >= remainingTime) {
        if (valvesToOpen.length === 0) break;
        const valve = valvesToOpen.pop();
        if (remainingTime > 2)
          score += valves[valve].flowRate * (remainingTime - 2);
      }
    }
  }
  return score;
}

function findBestScore(inputData, playerCount, initialTime) {
  let bestScore = 0;
  DFS({
    start: Array.from({ length: playerCount }, () => ({
      pos: "AA", path: ["AA"], remainingTime: initialTime
    })),
    neighbors: playerStates =>
      validMoves(inputData, playerStates).filter(newStates =>
        scoreUpperBound(inputData, newStates, initialTime) > bestScore
      ),
    stateToKey: JSON.stringify,
    onVisit: (states) => {
      const scoreSum = sum(states.map(({ path }) =>
        pathScore(inputData, path, initialTime))
      )
      if (scoreSum > bestScore) bestScore = scoreSum;
    },
  });
  return bestScore;
}

const part1 = inputData => findBestScore(inputData, 1, 30);
const part2 = inputData => findBestScore(inputData, 2, 26);

module.exports = { processInput, part1, part2 };