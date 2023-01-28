const { sum } = require("../lib/utils");

const parseCommand = (line) =>
  line.startsWith("$ cd") ? { type: "cd", dir: line.split(" ")[2] } : { type: "ls" }

const parseCommandOutput = (line) =>
  line.startsWith("dir")
    ? { type: "dir", name: line.split(" ")[1] }
    : { type: "file", name: line.split(" ")[1], size: parseInt(line.split(" ")[0]) }

function buildFileTree(terminalOutput) {
  let rootFolder = { size: 0, files: {} };
  let currentPathStack = [rootFolder];

  for (let line of terminalOutput) {
    const currentDir = currentPathStack.at(-1);
    switch (line.type) {
      case "cd":
        if (line.dir === "..")
          currentPathStack.pop();
        else if (line.dir === "/")
          currentPathStack = [rootFolder];
        else
          currentPathStack.push(currentDir.files[line.dir]);
        break;
      case "dir":
        currentDir.files[line.name] ||= { size: 0, files: {} }
        break;
      case "file":
        if (currentDir.files[line.name] === undefined) {
          currentDir.files[line.name] = { size: line.size };
          currentPathStack.forEach(dir => dir.size += line.size)
        }
        break;
    }
  }
  return rootFolder;
}

const processInput = input => buildFileTree(
  input.trim().replace(/\r\n/g, "\n").split("\n")
    .map(line => line.startsWith("$") ? parseCommand(line) : parseCommandOutput(line))
);

const isDirectory = file => file.files !== undefined;

function findFiles(root, condition) {
  const rootResult = condition(root) ? [root] : [];
  return !isDirectory(root) ? rootResult : [
    ...rootResult,
    ...Object.values(root.files).flatMap(file => findFiles(file, condition))
  ];
}

const part1 = rootFolder => sum(
  findFiles(
    rootFolder,
    file => isDirectory(file) && file.size <= 100_000
  ).map(x => x.size)
);

const part2 = rootFolder => Math.min(
  ...findFiles(
    rootFolder,
    file => isDirectory(file) && file.size >= 30_000_000 - (70_000_000 - rootFolder.size)
  ).map(x => x.size)
);

module.exports = { processInput, part1, part2 };
