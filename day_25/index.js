const { sum } = require("../lib/utils");

const processInput = input => input.trim().replace(/\r\n/g, "\n").split("\n");

function snafuToDecimal(str) {
  const digits = { "2": 2, "1": 1, "0": 0, "-": -1, "=": -2 };
  return str.split("").reverse()
    .reduce((result, char, i) => result + Math.pow(5, i) * digits[char], 0);
}

const digitCount = num => Math.floor((Math.log(2 * num) / Math.log(5))) + 1;

function digitAt(num, position) {
  const digits = ["=", "-", "0", "1", "2"];
  const scale = Math.pow(5, position);
  const offset = 2;
  const index = (Math.floor((num + Math.floor(scale / 2)) / scale) + offset) % digits.length;
  return digits[index];
}

function decimalToSnafu(num) {
  let result = "";
  for (let i = 0; i < digitCount(num); i++)
    result = digitAt(num, i) + result;
  return result;
}

const part1 = snafuNums => decimalToSnafu(sum(snafuNums.map(snafuToDecimal)));

module.exports = { processInput, part1 };
