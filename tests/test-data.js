module.exports = {
  day_01: { part1: 24000, part2: 45000 },
  day_02: { part1: 15, part2: 12 },
  day_03: { part1: 157, part2: 70 },
  day_04: { part1: 2, part2: 4 },
  day_05: { part1: "CMZ", part2: "MCD" },
  day_06: { part1: 7, part2: 19 },
  day_07: { part1: 95437, part2: 24933642 },
  day_08: { part1: 21, part2: 8 },
  day_09: { part1: 13, part2: 1 },
  day_10: {
    part1: 13140,
    part2: `
      ##..##..##..##..##..##..##..##..##..##..
      ###...###...###...###...###...###...###.
      ####....####....####....####....####....
      #####.....#####.....#####.....#####.....
      ######......######......######......####
      #######.......#######.......#######.....
    `.replaceAll(" ", "").replaceAll("#", "█").replaceAll(".", "░")
  },
  day_11: { part1: 10605, part2: 2713310158 },
  day_12: { part1: 31, part2: 29 },
  day_13: { part1: 13, part2: 140 },
  day_14: { part1: 24, part2: 93 },
  day_15: { part1: 26, part2: 56000011, args: { row: 10, coordMax: 20 } },
  day_16: { part1: 1651, part2: 1707 },
  day_17: { part1: 3068, part2: 1514285714288 },
  day_18: { part1: 64, part2: 58 },
  day_19: { part1: 33, part2: 56 * 62 },
  day_20: { part1: 3, part2: 1623178306 },
  day_21: { part1: 152, part2: 301 },
  day_22: { part1: 6032, part2: 5031, args: { connectionsFile: "day_22/sample_connections.json" } },
  day_23: { part1: 110, part2: 20 },
  day_24: { part1: 18, part2: 54 },
  day_25: { part1: "2=-1=0" },
}