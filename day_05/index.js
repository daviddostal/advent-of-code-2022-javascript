const { rotateGrid } = require("../lib/utils");

function processInput(input) {
  const [stacks, instructions] = input.trimEnd().replace(/\r\n/g, "\n").split("\n\n");
  return {
    stacks: rotateGrid(stacks.split("\n").slice(0, -1)
      .map(line => line.split("").filter((_, col) => col % 4 === 1))
    ).map(stack => stack.filter(crate => crate !== " ")),

    instructions: instructions.split("\n")
      .map(line => line.split(" ").filter((_, i) => i % 2 === 1).map(n => parseInt(n)))
      .map(([count, from, to]) => ({ count, from, to }))
  }
};

const getTopCrates = getCrateDropOrder => ({ stacks, instructions }) => {
  let newStacks = stacks.map(stack => stack.slice()); // clone stacks before rearranging
  instructions.forEach(({ count, from, to }) =>
    newStacks[to - 1].push(...getCrateDropOrder(newStacks[from - 1].splice(-count)))
  );
  return newStacks.map(stack => stack.at(-1)).join("");
}

const part1 = getTopCrates(originalOrder => originalOrder.reverse());
const part2 = getTopCrates(originalOrder => originalOrder);

module.exports = { processInput, part1, part2 };
