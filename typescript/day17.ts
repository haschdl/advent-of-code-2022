import { assert } from 'console';
import * as fs from 'fs'
import { Point as p, drawArrayOffSet } from './utils'
import { Range } from '../lib/Range'
import Graph from '../lib/Graph';
import { WeightedGraph } from '../lib/WeightedGraph';
import { Piece } from './piece';
import { bitsToString, isBitSet } from '../lib/Binary';
let input = "input/day17-input-samp.txt";
//let input = "input/day15-input-samp.txt" ;let y = 10;

type jet = "<" | ">"

const jets: jet[] = fs.readFileSync(input, 'utf8').split("").map(s => s as jet);
// console.log("Jet pattern", jets)

const p0 = [0b1111000, 0b0000000, 0b0000000, 0b0000000];
const p1 = [0b0100000, 0b1110000, 0b0100000, 0b0000000];
const p2 = [0b1110000, 0b0010000, 0b0010000, 0b0000000];
const p3 = [0b1000000, 0b1000000, 0b1000000, 0b1000000];
const p4 = [0b1100000, 0b1100000, 0b0000000, 0b0000000];

const ps = [{ p: p0, w: 4 }, { p: p1, w: 3 }, { p: p2, w: 3 }, { p: p3, w: 1 }, { p: p4, w: 2 }]

//Each rock appears so that its left edge is two units away from the left 
const pieces: Piece[] = ps.map(v => new Piece(v.p, v.w, 0))
function* jetMachine() {
    let i = -1;
    while (true) {
        i = (++i) % jets.length;
        yield jets[i];

    }
}

//TODO: account for rocks pieces on left/right of the pc
function pushNaive(pc: Piece, dir: jet, grid: number[]): boolean {

    if ((dir == ">" && pc.right >= 7) || (dir == "<" && pc.x == 0)) //hit walls
        return false;

    //const gridSlice = grid.slice(pc.bottom, pc.bottom + pc.height);
    //not needed to check length
    //if (gridSlice.length > 0) {

    const vv = pc.shifted(dir);
    const ix = pc.bottom;
    // below is equivalent to  gridSlice.some((v, ix) => (vv[ix] & v) != 0);
    const clashWithGrid = (
        ((grid[ix] & vv[0]) != 0) ||
        ((grid[ix + 1] & vv[1]) != 0) ||
        ((grid[ix + 2] & vv[2]) != 0) ||
        ((grid[ix + 3] & vv[3]) != 0));

    if (clashWithGrid)
        return false;
    //}
    pc.move(dir);
    return true;
}



const drawArray = (m: number[][]) => console.log(drawArrayOffSet(
    m.flatMap((r, y) =>
        r.reduce((res, v, x) => { if (v == 1) res.push(new p(x, y, "#")); return res }, [] as p[])))
);

const drawNumbers = (v: number[], out?: (s: string) => void) => {
    let str = bitsToString(v, 7, ".", "#");
    if (out !== undefined)
        out(str);
    else return str;
};


const printState = (someGrid: number[]) => {
    console.log("+-----+"); drawNumbers([...someGrid.slice().reverse()], console.log); console.log("+-----+");
}

let debug = true;

function goDown(pc: Piece, grid: number[]): boolean {
    if (pc.bottom == 0) {
        return false;
    }
    const ix = pc.bottom-1;
    // below is equivalent to  gridSlice.some((v, ix) => (vv[ix] & v) != 0);
    const clashWithGrid = (
        ((grid[ix] & pc.v[0]) != 0) ||
        ((grid[ix + 1] & pc.v[1]) != 0) ||
        ((grid[ix + 2] & pc.v[2]) != 0) ||
        ((grid[ix + 3] & pc.v[3]) != 0));
    /*
    const gridSlice = grid.slice(pc.bottom - 1, pc.bottom - 1 + pc.height);
    //SOME for checking if clashes with grid
   
    if (gridSlice.length == 0 || !gridSlice.some((v, ix) => (pc.v[ix] & v) != 0)) {
        pc.bottom--;
        return true;
    }
    */
    if (!clashWithGrid) {
        pc.bottom--;
        return true;
    }
    return false;
}

function simulate(rockCountMax: number): number {

    let rockCount: number = 0;
    let grid: number[] = [];

    let cumulativeHeight = 0;
    let currentGridHeight = 0;

    let jetsGen = jetMachine();



    for (rockCount = 0; rockCount < rockCountMax; rockCount++) {
        if (rockCount % 1000000 == 0)
            console.debug(`Rocks fallen ${(rockCount).toExponential(1)} Grid size: ${grid.length}`)

        let currentRock = pieces[rockCount % pieces.length];
        currentRock.init();
        currentRock.bottom = currentGridHeight + 3;

        if (debug) {
            const intermediate = grid.slice();
            currentRock.v.slice().forEach((v, i) => { let ix = currentRock.bottom + i; intermediate[ix] == undefined ? intermediate[ix] = v : intermediate[ix] |= v });
            printState(intermediate);
        }
        while (true) {
            pushNaive(currentRock, jetsGen.next().value as jet, grid); //push rock according to jet
            //console.log("Piece after move"); console.log("========"); drawPiece(currentRock); console.log("========")

            if (!goDown(currentRock, grid))
                break;

            if (debug) {
                const intermediate = grid.slice();
                currentRock.v.forEach((v, i) => { let ix = currentRock.bottom + i; intermediate[ix] == undefined ? intermediate[ix] = v : intermediate[ix] |= v });
                printState(intermediate);
            }
        }
        //it has rested=> add to grid (bottom first)
        currentRock.v.forEach((v, i) => { if (v == 0) return; let ix = currentRock.bottom + i; ix > grid.length - 1 ? grid.push(v) : grid[ix] |= v });

        //reset grid "once in while", just like tetris
        if (rockCount % 500== 0) {
            //check for line
            let cutAt = grid.findLastIndex((v,ix,arr) => (v|arr[ix+1]) == 127);
            if (cutAt > 0) {
                grid = grid.slice(cutAt);
                cumulativeHeight += cutAt;
                currentGridHeight = 0;
            }
        }

        currentGridHeight = grid.length;

        if (debug) {
            console.log(`Grid (after t=${rockCount}) maxHeight=${grid.length}}`);
            printState(grid);
        }

    }
    return cumulativeHeight + currentGridHeight;
}

//Part 1: simulate after 2022 rocks
debug = false;
let rockCount = 2022;
let solutionPart1 = simulate(rockCount);
console.log(`Grid (after ${rockCount} rocks) has height ${solutionPart1}`);
assert(solutionPart1 == 3068);

//Part 2: run simulation after 1 000 000 000 000 rocks (1e12)
rockCount = 1e12;
let solutionPart2 = simulate(rockCount);
console.log(`Grid (after ${rockCount} rocks) has height ${solutionPart2}`);
