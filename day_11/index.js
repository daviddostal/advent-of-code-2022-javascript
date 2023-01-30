const { product } = require("../lib/utils");

function parseOperation(operation) {
  const [_op1, operator, operand2] = operation.split("=").at(-1).trim().split(" ");
  return { operator, operand2: isNaN(operand2) ? "old" : parseInt(operand2) };
}

const processInput = input => input.trim().replace(/\r\n/g, "\n").split(/\n\n/)
  .map(monkey => monkey.split("\n").map(line => line.split(":")[1].trim()))
  .map(([_, startingItems, operation, test, ifTrue, ifFalse]) => ({
    startingItems: startingItems.split(", ").map(i => parseInt(i)),
    operation: parseOperation(operation),
    divisor: parseInt(test.split(" ").at(-1)),
    ifTrue: parseInt(ifTrue.split(" ").at(-1)),
    ifFalse: parseInt(ifFalse.split(" ").at(-1)),
  }));

function simulateMonkeys(monkeys, rounds, reduceWorryLevel) {
  const operations = { "+": (a, b) => a + b, "*": (a, b) => a * b };
  let monkeyInfo = monkeys.map(monkey => ({
    monkey, inspectCount: 0, items: monkey.startingItems.slice()
  }));

  for (let round = 1; round <= rounds; round++) {
    for (let info of monkeyInfo) {
      const { operation: { operator, operand2 }, divisor, ifTrue, ifFalse, } = info.monkey;

      while (info.items.length > 0) {
        const item = info.items.pop();
        const operandValue = (operand2 === "old") ? item : operand2;
        const worryLevel = reduceWorryLevel(operations[operator](item, operandValue));
        const throwTo = (worryLevel % divisor === 0) ? ifTrue : ifFalse;
        monkeyInfo[throwTo].items.push(worryLevel);
        info.inspectCount++;
      }
    }
  }
  return monkeyInfo;
}

const monkeyBusinessScore = monkeys => product(
  monkeys.map(m => m.inspectCount).sort((a, b) => b - a).slice(0, 2)
);

const part1 = monkeys => monkeyBusinessScore(
  simulateMonkeys(monkeys, 20, worryLevel => Math.floor(worryLevel / 3))
);

const part2 = monkeys => {
  const commonDivisor = product(monkeys.map(m => m.divisor));
  return monkeyBusinessScore(
    simulateMonkeys(monkeys, 10_000, worryLevel => worryLevel % commonDivisor)
  );
}

module.exports = { processInput, part1, part2 };
