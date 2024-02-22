const fs = require("fs");
const { count, chunk, wrapNum } = require("../lib/utils");

function rowGroupToFaces(rowGroup, faceRowIndex, faceSize) {
  let faces = Array(rowGroup[0].length / faceSize).fill().map(_ => []);
  rowGroup.forEach(row => {
    chunk(row, faceSize).forEach((part, x) =>
      faces[x].push(part)
    );
  });
  return faces.map((grid, faceColIndex) => ({ origin: [faceColIndex, faceRowIndex], grid }));
}

function parseCubeFaces(mapStr) {
  const parsedMap = mapStr.split("\n").map(line => line.trim().split(""));
  const faceSize = Math.sqrt(count(parsedMap.flat(), char => char !== " ") / 6);

  const cubeFaces = Object.fromEntries(
    // Group rows into 6 chunks of ${faceSize}
    chunk(parsedMap, faceSize)
      // Transform each row group into faces
      .map((rowGroup, faceRowIndex) => rowGroupToFaces(rowGroup, faceRowIndex, faceSize))
      // Flatten row groups to get only individual faces
      .flat()
      // Remove empty faces
      .filter(({ grid }) => !grid.some(row => row.some(val => val === " ")))
      // Add face numbers (starting from 1)
      .map((face, i) => [i + 1, face])
  );

  return { faceSize, cubeFaces };
}

function parsePathInstructions(pathStr) {
  return pathStr.split(/(L|R)/).map(instr =>
    /^\d+$/.test(instr)
      ? { type: "move", dist: parseInt(instr) }
      : { type: "turn", dir: instr.toLowerCase() }
  );
}

function processInput(input, { connectionsFile }) {
  if (typeof (connectionsFile) !== "string")
    throw new Error(`Missing puzzle argument 'connectionsFile' (string).`);
  const faceConnections = JSON.parse(fs.readFileSync(connectionsFile, "utf-8"));

  const [mapStr, pathStr] = input.trimEnd().replace(/\r\n/g, "\n").split("\n\n");
  const path = parsePathInstructions(pathStr);
  const { faceSize, cubeFaces } = parseCubeFaces(mapStr);

  return { path, cubeFaces, faceSize, faceConnections };
}

const orientationCoords = { r: [1, 0], d: [0, 1], l: [-1, 0], u: [0, -1] };
const orientations = Object.keys(orientationCoords);

function rotate(orientation, rotateBy) {
  return orientations[
    wrapNum(orientations.indexOf(orientation) + rotateBy, orientations.length)
  ];
}

function neighborPos(faceConnections, faceSize, { face, pos, orientation }) {
  const [xDir, yDir] = orientationCoords[orientation];
  const nextPos = [pos[0] + xDir, pos[1] + yDir];

  if (!nextPos.some(coord => coord < 0 || coord > (faceSize - 1)))
    return { face, pos: nextPos, orientation };

  const { face: nextFace, rot } = faceConnections[face][orientation];
  const turnBy = rot === undefined ? 0 : rot;

  const faceRotations = {
    0: ([x, y]) => [wrapNum(x, faceSize), wrapNum(y, faceSize)],
    2: ([x, y]) => [faceSize - 1 - wrapNum(x, faceSize), faceSize - 1 - wrapNum(y, faceSize)],
    1: ([x, y]) => [wrapNum(y, faceSize), faceSize - 1 - wrapNum(x, faceSize)],
    3: ([x, y]) => [faceSize - 1 - wrapNum(y, faceSize), wrapNum(x, faceSize)],
  }

  return {
    face: nextFace,
    pos: faceRotations[turnBy](nextPos),
    orientation: rotate(orientation, -turnBy)
  };
}

function move(faces, faceConnections, state, dist) {
  const faceSize = faces[1].grid.length;
  let currentState = state;
  for (let i = 0; i < dist; i++) {
    const nextState = neighborPos(faceConnections, faceSize, currentState);
    const nextValue = faces[nextState.face].grid[nextState.pos[1]][nextState.pos[0]];
    if (nextValue === "#")
      return currentState;
    else if (nextValue === ".")
      currentState = nextState;
    else
      throw new Error(`Moving to empty position ${JSON.stringify(nextState)}`);
  }
  return currentState;
}

function step(faces, faceConnections, { face, pos, orientation }, instruction) {
  return (instruction.type === "move")
    ? move(faces, faceConnections, { face, pos, orientation }, instruction.dist)
    : { face, pos, orientation: rotate(orientation, instruction.dir === "l" ? -1 : 1) };
}

function calculatePassword({ path, cubeFaces, faceSize }, faceConnections) {
  const initialState = { face: 1, pos: [0, 0], orientation: "r" };

  let currentState = initialState;
  for (let instruction of path)
    currentState = step(cubeFaces, faceConnections, currentState, instruction);

  const [xOffset, yOffset] = cubeFaces[currentState.face].origin.map(coord => coord * faceSize);
  const [finalCol, finalRow] = [currentState.pos[0] + xOffset + 1, currentState.pos[1] + yOffset + 1];
  const finalOrientation = orientations.indexOf(currentState.orientation);
  const password = 1000 * finalRow + 4 * finalCol + finalOrientation;

  return password;
}

const part1 = ({ faceConnections, ...input }) => calculatePassword(input, faceConnections.part1);
const part2 = ({ faceConnections, ...input }) => calculatePassword(input, faceConnections.part2);

module.exports = { processInput, part1, part2, argTypes: { connectionsFile: "string" } };
