const { BFS, minBy, maxBy, countBy } = require("../lib/utils");

const processInput = input => input.trim().replace(/\r\n/g, "\n").split("\n")
  .map(line => line.split(",").map(coord => parseInt(coord)));

const posToString = pos => pos.join(";");

// For a 1x1x1 cube/voxel position (defined by the coordinates of its center)
// get the midpoints of all its faces.
// This is useful, because the midpoint coordinates are the same for 2 faces
// of adjacent cubes which are "touching" each other.
const faceMidpoints = ([x, y, z]) => [
  [x + 0.5, y + 1.0, z + 0.5], [x + 0.5, y, z + 0.5], // top, bottom
  [x + 0.5, y + 0.5, z], [x + 0.5, y + 0.5, z + 1.0], // front, back
  [x, y + 0.5, z + 0.5], [x + 1.0, y + 0.5, z + 0.5], // left, right
];

// Get the surface area of a shape defined by positions of 1x1x1 voxels.
function getSurfaceArea(positions) {
  const allFaces = positions.map(faceMidpoints).flat().map(posToString);
  const occurrenceCounts = countBy(allFaces);
  // The surface area of a shape is the number of faces, which appear only 1x,
  // because they have no neighboring cube. Faces inside the shape would appear
  // exactly 2x, because the faces of 2 adjacent cubes/voxels are "touching"
  // each other.
  return allFaces.filter(face => occurrenceCounts.get(face) === 1).length;
};

const part1 = lavaDrop => getSurfaceArea(lavaDrop);

const neighborPositions = ([x, y, z]) => [
  [x, y + 1, z], [x, y - 1, z], // top, bottom
  [x - 1, y, z], [x + 1, y, z], // left, right
  [x, y, z - 1], [x, y, z + 1], // front, back
];

function* generateCubePositions(minX, maxX, minY, maxY, minZ, maxZ) {
  for (let x = minX; x <= maxX; x++)
    for (let y = minY; y <= maxY; y++)
      for (let z = minZ; z <= maxZ; z++)
        yield [x, y, z];
}

function part2(lavaDrop) {
  const findBounds = (arr, key) => [minBy(arr, key), maxBy(arr, key)].map(key);
  const [minX, maxX] = findBounds(lavaDrop, pos => pos[0]);
  const [minY, maxY] = findBounds(lavaDrop, pos => pos[1]);
  const [minZ, maxZ] = findBounds(lavaDrop, pos => pos[2]);

  // A cube 1 voxel bigger than the lava drop in every direction guarantees
  // that all voxels outside the drop are connected (this makes it possible
  // to use a simple flood fill to get all cube positions outside of the drop).
  const allPositions = [...generateCubePositions(
    minX - 1, maxX + 1, minY - 1, maxY + 1, minZ - 1, maxZ + 1
  )];
  const filledPositions = new Set(lavaDrop.map(posToString));
  const emptyPositions = new Map(allPositions
    .filter(pos => !filledPositions.has(posToString(pos)))
    .map(pos => [posToString(pos), pos])
  )

  // Use flood fill from a corner to get all positions outside of the lava drop.
  const startPos = [minX, minY, minZ];
  let outsidePositions = new Set([posToString(startPos)]);
  BFS({
    start: startPos,
    neighbors: pos => neighborPositions(pos)
      .filter(n => emptyPositions.has(posToString(n))),
    stateToKey: posToString,
    onVisit: pos => outsidePositions.add(posToString(pos)),
  });

  // The empty positions (air pockets) _inside_ the lava drop are those empty
  // positions, which are not outside the lava drop.
  let insidePositions = [...emptyPositions.values()]
    .filter(pos => !outsidePositions.has(posToString(pos)))

  // The outside surface area of the lava drop is its total surface area minus
  // the surface area of inside air pockets.
  return getSurfaceArea(lavaDrop) - getSurfaceArea(insidePositions);
}

module.exports = { processInput, part1, part2 }