import * as fs from 'fs'
import { Point as p, drawArrayOffSet } from './utils'
import { Range } from '../lib/Range'
import { assert } from 'console';
const input = "input/day23-input.txt";

const raw: string[] = fs.readFileSync(input, 'utf8').split("\n");

let grid = raw.flatMap((l, y) => l.split("").map((v, x) => new p(x, y, v)));

const gridAt = (p: p, search: p[]) => {
    return search.find(s => s.equals(p));
}

// order must match order of offsets
//           N, NE, NW,  S, SE, SW, W,  NW, SW, E,  NE, SE
const xI = [+0, +1, -1, +0, +1, -1, -1, -1, -1, +1, +1, +1];
const yI = [-1, -1, -1, +1, +1, +1, +0, -1, +1, +0, -1, +1];
//The scan shows Elves # and empty ground .; outside your scan, more empty ground extends a long way in every direction.
//This means that "outside" of grid is a valid destination
const canMoveImediate = (target?: p) => target == undefined || target.c == ".";
const neig = (p: p, i: number) => gridAt(p.add(xI[i], yI[i]), grid);
const couldMove = (start: p, directionOffset: number): p | undefined => {

    //During the first half of each round, each Elf considers the *eight* positions adjacent to themself. 
    //If no other Elves are in one of those eight positions, the Elf does not do anything during this round.
    //   [N], [NE], [NW],  [S], [SE], [SW], [W],  NW, SW, [E],  NE, SE
    const atLeastOne = [0, 1, 2, 3, 4, 5, 6, 9].some(i => isElf(gridAt(start.add(xI[i], yI[i]), grid)));
    if (!atLeastOne)
        return undefined;


    for (let i = 0; i < 4; i += 1) {
        const ix0 = (directionOffset * 3) % 12; //shifts at every "round"
        const offSetIx = (ix0 + i * 3) % 12;
        if (Range.from(offSetIx, offSetIx + 3).every(i => canMoveImediate(neig(start, i)))) {
            return start.add(xI[offSetIx], yI[offSetIx]);

        }
    }
    return undefined;

}

const isElf = (p?: p): boolean => (p != undefined) && p.c == "#";

//Finally, at the end of the round, the first direction the Elves considered is 
//moved to the end of the list of directions. For example, during the second round, 
//the Elves would try proposing a move to the south first, then west, then east, then north.
//On the third round, the Elves would first consider west, then east, then north, then south.

const round = (grid: p[], roundCount: number, outputIntermedite = false) => {
    let intermediate: p[] = [];

    if (outputIntermedite)
        intermediate = grid.map(e => e.clone());

    const couldMoveList = new Map<string, number[]>;

    grid.forEach((p, ix) => {
        if (!isElf(p))
            return;

        //During the first half of each round, each Elf considers the eight positions adjacent to themself. 
        //If no other Elves are in one of those eight positions, 
        //the Elf does not do anything during this round.
        const nextPos = couldMove(p, roundCount);

        if (nextPos != undefined) {
            if (outputIntermedite)
                intermediate[ix].c = "o";
            updateMap(nextPos, couldMoveList, ix);
        }
    });

    //if next positions are unique, then move
    let moved = 0;
    for (const v of couldMoveList) {
        if (v[1].length == 1) { //only if next positions are unique
            moved++;
            const ix = v[1][0];
            const nextPos = p.parseString(v[0]);


            //"move" by updating the contents
            if (gridAt(nextPos, grid) == undefined)
                grid.push(nextPos.setC("#"));
            else
                gridAt(nextPos, grid)?.setC("#");

            //update old position;
            grid[ix].setC(".");
        }
    }

    //move
    return { intermediate: intermediate, moved: moved };
}


Range.from(0, 10).forEach(i => {
    //console.log(`== End of Round ${i} ==`);
    //const inter = round(grid, i);
    round(grid, i);
    //console.log(drawArrayOffSet(inter));
    //console.log(drawArrayOffSet(grid));
});
console.log(drawArrayOffSet(grid));

const onlyElves = grid.filter(isElf);
const [minX, maxX] = [Math.min(...onlyElves.map(p => p.x)), Math.max(...onlyElves.map(p => p.x))];
const [minY, maxY] = [Math.min(...onlyElves.map(p => p.y)), Math.max(...onlyElves.map(p => p.y))];

let count = 0;

//this is one of doing it
Range.from(minY, maxY + 1).forEach(y => Range.from(minX, maxX + 1).forEach(x => {
    const check = gridAt(new p(x, y), onlyElves);
    if (check == undefined || check.c == ".") count++;
}));

//a simpler form: const countSpaces=(maxY-minY+1)*(maxX-minX+1) - onlyElves.length;

//4034 too hight
//3094 : too low
console.log("Part 1 - number of empty spaces in the grid", count)
assert(count == 3874)

//part 2: simulate until no elves need to move
//reset grid
grid = raw.flatMap((l, y) => l.split("").map((v, x) => new p(x, y, v)));
let i = 1;
let result = round(grid, 0);
while (result.moved > 0) {
    result = round(grid, i);
    i++;
    if (i % 10 == 0)
        console.log("simulating for rounds", i)
}
console.log("Part 2 - First round where no elf moved", i)
assert(i==948);

function updateMap(nextPos: p, couldMoveList: Map<string, number[]>, ix: number) {
    const mapKey = nextPos.toString();
    if (couldMoveList.has(mapKey))
        couldMoveList.get(mapKey)?.push(ix);

    else
        couldMoveList.set(mapKey, [ix]);
}
