# Advent of Code 2022 solutions in JavaScript

This repository contains my solutions to all 50 (technically 49) puzzles from Advent of Code 2022.

I challenged myself to first solve each puzzle on my own, without looking at
hints or solutions from other people. Only after I found the correct answer
did I sometimes look at other solutions to learn from them while trying to further
improve the code and performance of my solution.

Most solutions should take only a few milliseconds to run, but a small number of
them may take up to a few seconds to compute the answer.

## Running a solution

Since the puzzle inputs of Advent of Code
[should not be redistributed](https://adventofcode.com/about#faq_copying),
this repo contains only the solutions, and you'll need to run them on your own puzzle inputs.

To run a solution, you can use the `run-solution.js`
script in the root of this repo, which not only runs the solution
with the given input, but also measures the time it took to run each part.

```bash
node run-solution.js [solution_file] [puzzle_input_file]
```

For example, to run the solution `day_01/index.js`, you can execute the following command:

```bash
node run-solution.js day_01/index.js day_01/puzzle_input.txt
```

Or in short:

```bash
node run-solution day_01 day_01/puzzle_input.txt
```

### Passing additional arguments

To pass additional values to the puzzle solution that are not part
of the puzzle input, you can add them as additional command line arguments:

```bash
node run-solution day_15 day_15/sample_input.txt --row=10 --coordMax=20
```

Most puzzle solutions don't take additional arguments.

## Running tests

The included tests check the puzzle solutions against the sample inputs provided in the puzzle descriptions. You can run the tests with the following command:

```bash
node ./tests/run-tests.js
```
