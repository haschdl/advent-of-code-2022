import * as fs from 'fs';
import { printGrid } from './utils';
let input = "input/day9-input.txt"

const rawData: string[][] = fs.readFileSync(input, 'utf8').split("\n").map(l => l.split(" "));

type direction = "U" | "D" | "R" | "L"
type move = { dir: direction, steps: number }
type pos = { x: number, y: number }

// Part 1
type cell = "+" | "H" | "T"

const moves = rawData.map(line => ({ dir: line[0], steps: Number(line[1]) }) as move)

let headPositions: pos[] = []
let tailPositions: pos[] = []

/**
 * Distance in a grid. A diagonal is also distance 1.
 */
const dist = (p1: pos, p2: pos) => {
    return Math.max(Math.abs(p1.y - p2.y), Math.abs(p1.x - p2.x));
}

const applyMoves = (move: move) => {
    let headPos = headPositions.slice(-1)[0];
    let tailPos = tailPositions.slice(-1)[0];

    const newPosHead = moveOneStep(headPos, move.dir);
    headPositions.push({ ...newPosHead });

    //1. if H and T are in the same place: T stays in the same position
    if (newPosHead.x == tailPos.x && newPosHead.y == tailPos.y) {
        return;
    }

    //2.  H is at of of 4 sides: T swaps with H if new distance inscreases
    /*
    *  - H -
    *  H T H
    *  - H -
    */

    if (dist(newPosHead, tailPos) > 1) {
        tailPositions.push({ ...headPos });
    }
}

const moveOneStep = (pos: pos, direction: direction): pos => {
    let newPos = { x: pos.x, y: pos.y }

    switch (direction) {
        case "U":
            newPos.y += 1;
            break;
        case "R":
            newPos.x += 1;
            break;
        case "L":
            newPos.x -= 1;
            break;
        case "D":
            newPos.y -= 1;
            break;
    }
    return newPos;
}

headPositions.push({ x: 0, y: 0 })
tailPositions.push({ x: 0, y: 0 })

const drawGrid = (headPositions: pos[], tailPositions: pos[]) => {
    const positions = [...headPositions, ...tailPositions];
    const [minX, maxX] = [Math.min(...positions.map(p => p.x)), Math.max(...positions.map(p => p.x))];
    const [minY, maxY] = [Math.min(...positions.map(p => p.y)), Math.max(...positions.map(p => p.y))];
    const s = Math.max(Math.abs(maxX - minX), Math.abs(maxY - minY)) + 1;
    let grid: cell[][] = new Array(s).fill(0).map(_ => new Array(s).fill("+"));
    headPositions.forEach(p => grid[s - 1 - p.y + minY][p.x - minX] = "H")
    tailPositions.forEach(p => grid[s - 1 - p.y + minY][p.x - minX] = "T")
    printGrid(grid)
}

moves.forEach(m => {
    new Array(m.steps).fill(0).forEach(
        _ => {
            applyMoves(m)
            //drawGrid(headPositions.slice(-1), tailPositions);
        })
});

//drawGrid([], tailPositions);

//hack to get unique values
const tailPositionsUnique = new Set(tailPositions.map(i => `${i.x}|${i.y}`))
console.log("Solution part 1", tailPositionsUnique.size) //6030


// Part 2: rope has 10 knots...

//positions of each of the 10 knot
//the last position of each knot i is pos[i].slice(-1)[0]
const positions: pos[][] = new Array(10).fill(0).map(_ => [{ x: 0, y: 0 }]);

const advanceAtPosition = (i: number, positions: pos[][], move: move) => {
    let headPos = positions[i].slice(-1)[0];
    const newPosHead = moveOneStep(headPos, move.dir);
    positions[i].push({ ...newPosHead });
}

const followAtPosition = (i: number, positions: pos[][]) => {
    let headPos = positions[i - 1].slice(-1)[0];
    let tailPos = positions[i].slice(-1)[0];

    //no need to follow if distance is 1
    if (dist(headPos, tailPos) <= 1)
        return;

    if (tailPos) {
        if (headPos.x == tailPos.x && headPos.y == tailPos.y + 2)
            tailPos = moveOneStep(tailPos, "U");
        else if (headPos.x == tailPos.x && headPos.y == tailPos.y - 2)
            tailPos = moveOneStep(tailPos, "D");
        else if (headPos.y == tailPos.y && headPos.x == tailPos.x + 2)
            tailPos = moveOneStep(tailPos, "R");
        else if (headPos.y == tailPos.y && headPos.x == tailPos.x - 2)
            tailPos = moveOneStep(tailPos, "L");
        
        //diagonals
        else if (headPos.y > tailPos.y && headPos.x > tailPos.x) {
            tailPos = moveOneStep(tailPos, "R");
            tailPos = moveOneStep(tailPos, "U");
        }
        else if (headPos.y < tailPos.y && headPos.x > tailPos.x) {
            tailPos = moveOneStep(tailPos, "R");
            tailPos = moveOneStep(tailPos, "D");
        }
        else if (headPos.y > tailPos.y && headPos.x < tailPos.x) {
            tailPos = moveOneStep(tailPos, "L");
            tailPos = moveOneStep(tailPos, "U");
        }
        else if (headPos.y < tailPos.y && headPos.x < tailPos.x) {
            tailPos = moveOneStep(tailPos, "L");
            tailPos = moveOneStep(tailPos, "D");
        }

        positions[i].push({ ...tailPos });
    }
}

const drawGridGeneric = (positions: pos[][]) => {
    const positionsFlat = positions.flatMap(i => i);
    const [minX, maxX] = [Math.min(...positionsFlat.map(p => p.x)), Math.max(...positionsFlat.map(p => p.x))];
    const [minY, maxY] = [Math.min(...positionsFlat.map(p => p.y)), Math.max(...positionsFlat.map(p => p.y))];
    const s = Math.max(Math.abs(maxX - minX), Math.abs(maxY - minY)) + 1;

    let grid: string[][] = new Array(s).fill(0).map(_ => new Array(s).fill(" + "));
    positions.forEach((pos, ix) => pos.slice(-1).forEach(p => grid[s - 1 - p.y + minY][p.x - minX] = `[${ix == 0 ? "H" : ix}]`));
    printGrid(grid)
}

const iter = new Int16Array(9);
moves.forEach(m => {
    new Array(m.steps).fill(0).forEach(
        _ => {
            advanceAtPosition(0, positions, m); //move head (0)
            iter.forEach((_, i) => followAtPosition(i + 1, positions)); //follow 1-9
        })
    //only useful for the sample input files
    if (rawData.length < 20)
        drawGridGeneric(positions);
});

//hack to get unique values
const tailPositionsUniqueLongRope = new Set(positions[9].map(i => `${i.x}|${i.y}`))
console.log("Solution part 2", tailPositionsUniqueLongRope.size) 
