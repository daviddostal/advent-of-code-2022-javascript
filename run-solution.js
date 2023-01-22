// First argument of the script is the solution script to run,
// the second argument is the input file. For example:
// $ node run-solution day_01 day_01/sample_input.txt

const fs = require("fs");
const path = require("path");
const { performance } = require('perf_hooks');

function profile(callback) {
  const beforeTime = performance.now();
  const result = callback();
  const afterTime = performance.now();
  return { result, timeMs: afterTime - beforeTime };
}

const [solutionFile, inputFile] = process.argv.slice(2);
const { processInput, part1, part2 } = require(path.resolve(solutionFile));
const inputText = fs.readFileSync(path.resolve(inputFile), "utf-8");

console.log("");

let processedInput;
if (typeof (processInput) === "function") {
  console.log("Processing puzzle input...");
  const { result, timeMs } = profile(() => processInput(inputText))
  processedInput = result;
  console.log(`(Processing took ${timeMs.toFixed(4)} ms.)`);
  console.log("");
} else {
  console.log("Skipped input processing.");
  processedInput = inputText;
  console.log("");
}

function runPartSolution(processedInput, solvePart, partNo) {
  console.log(`Running part ${partNo}...`);
  const { result, timeMs } = profile(() => solvePart(processedInput));
  console.log(`(Part ${partNo} took ${timeMs.toFixed(4)} ms.)`);
  console.log(`Part ${partNo} result: ${result}`);
  console.log("");
}

if (part1 !== undefined) runPartSolution(processedInput, part1, 1);
if (part2 !== undefined) runPartSolution(processedInput, part2, 2);
