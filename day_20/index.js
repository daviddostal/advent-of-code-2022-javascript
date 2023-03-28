const { sum } = require("../lib/utils");

const processInput = input => input.trim().replace(/\r\n/g, "\n").split("\n")
  .map(n => parseInt(n));

// Creates a circular doubly-linked list of nodes from an array of values.
function linkCircle(values) {
  let startNode = { value: values[0], next: undefined, prev: undefined };
  let currentNode = startNode;
  let nodes = [startNode];
  for (let i = 1; i < values.length; i++) {
    const next = { value: values[i], next: undefined, prev: currentNode };
    currentNode.next = next;
    nodes.push(next);
    currentNode = next;
  }
  currentNode.next = startNode;
  startNode.prev = currentNode;
  return nodes;
}

// Finds a node with the specified distance from the current node.
// If a negative distance is provided, the nodes are counted in the opposite
// direction.
function nodeAtDistance(currentNode, distance) {
  if (distance >= 0) {
    for (let i = 0; i <= distance; i++)
      currentNode = currentNode.next;
  } else {
    for (let i = distance; i < 0; i++)
      currentNode = currentNode.prev;
  }
  return currentNode;
}

// Moves a node from its current position to a new position specified by the
// distance. The distance can be negative to move in the opposite direction.
function move(node, distance) {
  // find node to insert before
  const insertBefore = nodeAtDistance(node, distance);

  // remove node from current position
  node.prev.next = node.next;
  node.next.prev = node.prev;

  // insert node at desired position
  node.next = insertBefore;
  node.prev = insertBefore.prev;
  insertBefore.prev.next = node;
  insertBefore.prev = node;
}

// Moves each node forward or backward a number of positions equal to the value
// of the node being moved.
function mix(nodes) {
  nodes.forEach(node => move(node, node.value % (nodes.length - 1)));
  return nodes;
}

function groveCoordSum(numbers, rounds = 1) {
  const linkedNodes = linkCircle(numbers);

  for (let i = 0; i < rounds; i++)
    mix(linkedNodes);

  const zeroNode = linkedNodes.find(n => n.value === 0);
  const keyNodes = [1000, 2000, 3000].map(dist =>
    nodeAtDistance(zeroNode, dist % linkedNodes.length - 1).value
  );
  return sum(keyNodes);
}

const part1 = parsedInput => groveCoordSum(parsedInput);

const decryptionKey = 811589153;
const part2 = parsedInput =>
  groveCoordSum(parsedInput.map(n => n * decryptionKey), 10);

module.exports = { processInput, part1, part2 };
