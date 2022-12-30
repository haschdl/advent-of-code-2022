# Advent of Code 2022
These are my solutions for the puzzles in the Advent of Code 2022.

> If you are not familiar with Advent of Code: the solutions are not meant to 
> represent best-practices or best-performant code - the goal is solve the puzzles
> in a timely manner.

I started making the solutions in Javascript (folder `/javascript`), until day 4.

Then I switched to Typescript, as I thought it would be beneficial for the more difficult challenges (folder `/typescript`).

When both files are present (e.g. days 1 to 4), the Typescript files in the repo are **not** the transpilation of the javascript files. They are refactored versions of the initial Javascript solutions.


# The lessons learned
These is a summary in no particular order of some lessons learned or traps that I fell for during the puzzles. Lots of debugging!


# Day 21

    > Multiplication and substraction are non-commutative. 

You need to parse text to form a simple arithmethic expression (`dddd: xxx + yyyy`). Part 1 of the puzzle was simple, but one approach to solve part 2 required "reversing" the operations. Here not paying attention to
the `non-commutative` nature of `*` and `-` has cost me a lot of time debugging.  
Other concepts in this puzzle: https://en.wikipedia.org/wiki/Tree_traversal#Pre-order,_NLR