const processInput = input => input.trim().replace(/\r\n/g, "\n").split("\n")
  .map(instr => instr.split(" "))
  .map(([instr, arg]) => instr === "addx" ? { instr, arg: parseInt(arg) } : { instr });

function executeInstructions(instructions, onTick) {
  let [registerX, cycleCount] = [1, 1];
  for (let { instr, arg } of instructions) {
    onTick(cycleCount, registerX);
    cycleCount++;
    if (instr === "addx") {
      onTick(cycleCount, registerX)
      registerX += arg;
      cycleCount++;
    }
  }
}

function part1(instructions) {
  let resultSum = 0;
  executeInstructions(instructions, (cycle, registerX) => {
    if (cycle % 40 === 20) resultSum += cycle * registerX;
  });
  return resultSum;
}

function part2(instructions) {
  const [filledChar, emptyChar] = ["█", "░"];
  const screenWidth = 40;

  const screenX = (cycle) => (cycle - 1) % screenWidth;
  const isVisible = (cycle, spritePosition) => Math.abs(screenX(cycle) - spritePosition) <= 1;

  let resultImage = "\n";
  executeInstructions(instructions, (cycle, spritePosition) => {
    resultImage += isVisible(cycle, spritePosition) ? filledChar : emptyChar;
    if (screenX(cycle) === screenWidth - 1) resultImage += "\n";
  });
  return resultImage;
}

module.exports = { processInput, part1, part2 };
