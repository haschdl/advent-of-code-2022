import * as fs from 'fs';
import { Stack } from './Stack';

let input = "input/day5-input.txt"

const rawData = fs.readFileSync(input, 'utf8').split("\n");

type move = { qty: number, from: number; to: number }

//reading initial state of stacks
const stackInput = rawData.slice(0, 8).map(e => new Array(9).fill(0).map((val, ix) => e[1 + ix * 4]));
//reverse is to ended up with last item on top of the stack
stackInput.reverse();

let stacks: Stack<string>[] = new Array(9).fill(0).map(i => new Stack(999));

stackInput.forEach((row) => {
    row.forEach((col, colIx) => { if (col.trim().length > 0) stacks[colIx].push(col) });
});


console.log(stacks)


//reading movements: lines 10
const regexp = /[\d]+/g;
const moveMatches = rawData.slice(10).map(e => e.match(regexp)) // "move" "from" "to"
if (!moveMatches)
    console.error("Data parsing failed!");

let movesNumbers = moveMatches.map(m => m?.flatMap(value => Number(value)));
const moves: move[] = movesNumbers.map(m => ({ qty: m![0], from: m![1], to: m![2] }))

console.log(moves)

moves.forEach(move => {
    for (let i = 0; i < move.qty; i++) {
        const itemToMove = stacks[move.from-1].pop();
        if (itemToMove)
            stacks[move.to-1].push(itemToMove);
        else
            console.error("Attempted to pop() from an empty stack!")
    }
});

const solutionPart1 =  stacks.map(e => e.peek()).join('');
console.log("Stack after moves (CreateMover 9000) (part 1)",solutionPart1)
console.assert(solutionPart1=="TWSGQHNHL")


/******** PART 2   *************/
//resetting the stacks; some duplicate code from above
stacks = new Array(9).fill(0).map(i => new Stack(999));
stackInput.forEach((row) => {
    row.forEach((col, colIx) => { if (col.trim().length > 0) stacks[colIx].push(col) });
});

moves.forEach(move => {
    const cratesToMove:string[] = [];
    for (let i = 0; i < move.qty; i++) {
        const itemToMove = stacks[move.from-1].pop();
        if (itemToMove)
            cratesToMove.push(itemToMove);
        else
            console.error("Attempted to pop() from an empty stack!")
    }
    cratesToMove.reverse().forEach(create => stacks[move.to-1].push(create))
});

console.log("Stack after moves (CreateMover 9001) (part 2)", stacks.map(e => e.peek()).join(''))
