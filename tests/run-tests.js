const fs = require("fs");
const path = require("path");
const assert = require('assert');

function runTest(dayNo, partNo, runPart, input, additionalArgs = {}, expectedOutput) {
  try {
    const partResult = runPart(input, additionalArgs);
    try {
      assert.deepStrictEqual(expectedOutput, partResult);
      console.log(`✅ Day ${dayNo} part ${partNo}`);
    } catch (err) {
      console.error(`❌ Day ${dayNo} part ${partNo}: Expected result ${expectedOutput}, got ${partResult}.`);
    }
  } catch (err) {
    console.error(`❌ Day ${dayNo} part ${partNo}: Threw error!`);
    console.log("");
    throw err;
  }
}

const expectedResults = require("./test-data.js");

for (let [day, results] of Object.entries(expectedResults)) {
  const puzzleDir = path.resolve(__dirname, `../${day}/`);

  const solutionFile = path.join(puzzleDir, "index.js")
  const { processInput, part1, part2 } = require(solutionFile);

  const inputFile = path.join(puzzleDir, "sample_input.txt");
  const puzzleInput = fs.readFileSync(inputFile, "utf-8");
  try {
    const processedInput = processInput(puzzleInput, results.args);
    const dayNo = parseInt(day.split("_")[1]);

    if (results.part1)
      runTest(dayNo, 1, part1, processedInput, results.args, results.part1);

    if (results.part2)
      runTest(dayNo, 2, part2, processedInput, results.args, results.part2);

  } catch (err) {
    console.error(`❌ Day ${day}: 'processInput' threw error!`);
    console.log("");
    throw err;
  }
}
