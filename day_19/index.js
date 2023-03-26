const { DFS, sum, product } = require("../lib/utils");

const ResourceType = { ORE: 0, CLAY: 1, OBSIDIAN: 2, GEODE: 3 };

// Because at most one robot can be built every minute, there is no point in
// having more robots collecting a resource, than what is required for building
// the most "expensive" robot.
// Except for geodes - although no geodes are needed to build robots, there is
// no upper limit on the number of geode-collecting robots.
const maxNeededRobots = robotCosts => Object.values(ResourceType).map(resType =>
  Math.max(...robotCosts.map(costs => costs[resType])) || Infinity
);

const processInput = (input) => input.trim().replace(/\r\n/g, "\n").split("\n")
  .map(line => line.split(": ")[1].slice(0, -1).split(". "))
  .map(lines => lines.map(line => {
    const costs = Object.fromEntries(line.split("costs ")[1].split(" and ")
      .map(cost => cost.split(" ").reverse())
      .map(([type, cost]) => [type, parseInt(cost)])
    );
    return Object.keys(ResourceType).map(res => costs[res.toLowerCase()] || 0);
  }))
  .map(robotCosts => ({ robotCosts, maxRobots: maxNeededRobots(robotCosts) }));

// Get the time required until a robot of a given type is built, including the
// time needed to collect any missing resources needed for building the robot.
// If the robot cannot be build using the current robots and resources and would
// require building a different robot first, the function returns +Infinity.
function timeToBuildRobot(robotType, robotCosts, { robots, resources }) {
  const neededResources = robotCosts[robotType].map((cost, type) =>
    Math.max(0, cost - resources[type])
  );
  const resourceCollectionTimes = neededResources.map((neededCount, type) =>
    (neededCount === 0) ? 0 : Math.ceil(neededCount / robots[type])
  );
  return Math.max(...resourceCollectionTimes) + 1;
}

function buildRobot(type, robotCosts, { robots, resources, remainingTime }) {
  const buildTime = timeToBuildRobot(type, robotCosts, { resources, robots });

  const newRobots = robots.slice();
  newRobots[type] = robots[type] + 1;

  return {
    robots: newRobots,
    resources: resources.map((count, resource) =>
      count
      + robots[resource] * buildTime // new resources collected
      - robotCosts[type][resource] // resources used for building robot
    ),
    remainingTime: remainingTime - buildTime,
  }
}

function validActions({ robotCosts, maxRobots }, state) {
  const robotsToBuild = Object.values(ResourceType).reverse().filter(type =>
    state.robots[type] < maxRobots[type] &&
    timeToBuildRobot(type, robotCosts, state) < state.remainingTime
  )
  return robotsToBuild.map(type => buildRobot(type, robotCosts, state));
};

// The expected number of collected geodes after the remaining time is up,
// assuming no new robots will be built.
const expectedScore = ({ robots, resources, remainingTime }) =>
  resources[ResourceType.GEODE] + robots[ResourceType.GEODE] * remainingTime;

// Calculates the maximum possible amount of collected geodes, assuming one
// geode-collecting robot can be built every minute of the remaining time.
const scoreUpperBound = ({ robots, resources, remainingTime }) =>
  // geodes collected by existing robots
  expectedScore({ robots, resources, remainingTime }) +
  // geodes collected by robots built in the remaining time
  remainingTime * (remainingTime - 1) / 2;


function bestBlueprintScore(blueprint, remainingTime) {
  let maxGeodesCollected = 0;
  DFS({
    start: { robots: [1, 0, 0, 0], resources: [0, 0, 0, 0], remainingTime },
    neighbors: state => validActions(blueprint, state)
      .filter(state => scoreUpperBound(state) > maxGeodesCollected),
    onVisit: state =>
      maxGeodesCollected = Math.max(maxGeodesCollected, expectedScore(state)),
    stateToKey: ({ robots, resources, remainingTime }) =>
      [remainingTime, ";", robots.join(","), ";", resources.join(",")].join(""),
  });
  return maxGeodesCollected;
}

const part1 = blueprints => sum(
  blueprints.map((blueprint, i) => (i + 1) * bestBlueprintScore(blueprint, 24))
);

const part2 = blueprints => product(
  blueprints.slice(0, 3).map(blueprint => bestBlueprintScore(blueprint, 32))
);

module.exports = { processInput, part1, part2 };
