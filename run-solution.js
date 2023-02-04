// First argument of the script is the solution script to run, the second argument
// is the input file. Any additional arguments get passed as options to the solution.
// For example:
// $ node run-solution day_01 day_01/sample_input.txt --arg1=value1

const fs = require("fs");
const path = require("path");
const { performance } = require('perf_hooks');

function profile(callback) {
  const beforeTime = performance.now();
  const result = callback();
  const afterTime = performance.now();
  return { result, timeMs: afterTime - beforeTime };
}

const truthyStrings = ["true", "1", "t", "y", "yes", "on", ""];
const falsyStrings = ["false", "0", "f", "n", "no", "off"];
const argParsers = {
  string: str => str,
  int: str => {
    if (/^[+-]?\d+$/.test(str)) return parseInt(str, 10);
    else throw new Error(`The value '${str}' is not a valid integer.`);
  },
  float: str => {
    if (/^[+-]?\d+(\.\d+)?$/.test(str)) return parseFloat(str);
    else throw new Error(`The value '${str}' is not a valid number.`);
  },
  bool: str => {
    if (truthyStrings.includes(str.toLowerCase())) return true;
    else if (falsyStrings.includes(str.toLowerCase())) return false;
    else throw new Error(`The value '${str}' is not a valid boolean.`);
  },
}

function parseArgs(args, argTypes = {}) {
  return Object.fromEntries(args
    .map(arg => arg.indexOf("=") === -1 ? [arg, ""] : arg.split("="))
    .map(([name, value]) => [name.replace(/^-{1,2}/, ""), value])
    .map(([name, value]) => {
      const type = argTypes[name];
      if (type === undefined) return [name, value];
      const parser = argParsers[type];
      if (parser === undefined) throw new Error(`Unsupported argType '${type}'.`);
      try {
        return [name, parser(value)];
      } catch (err) {
        throw new Error(`Argument '${name}' must be of type '${type}'. ${err.message}`, { cause: err });
      }
    })
  );
}

function runInputProcessing(processInput, additionalArgs) {
  console.log("Processing puzzle input...");
  const { result, timeMs } = profile(() => processInput(inputText, additionalArgs));
  console.log(`(Processing took ${timeMs.toFixed(4)} ms.)`);

  return result;
}

function runSolutionPart(processedInput, solution, partNo, additionalArgs) {
  console.log(`Running part ${partNo}...`);
  const { result, timeMs } = profile(() => solution(processedInput, additionalArgs));
  console.log(`(Part ${partNo} took ${timeMs.toFixed(4)} ms.)`);
  console.log(`Part ${partNo} result: ${result}`);
  console.log("");
}

const [solutionFile, inputFile, ...args] = process.argv.slice(2);
const { processInput, part1, part2, argTypes } = require(path.resolve(solutionFile));
const inputText = fs.readFileSync(path.resolve(inputFile), "utf-8");

const parsedArgs = parseArgs(args, argTypes);

console.log("");

let processedInput = inputText;
if (processInput === undefined) console.log("Skipped input processing.");
else processedInput = runInputProcessing(processInput, parsedArgs);

console.log("");

if (part1 !== undefined) runSolutionPart(processedInput, part1, 1, parsedArgs);
if (part2 !== undefined) runSolutionPart(processedInput, part2, 2, parsedArgs);
