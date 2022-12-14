import { assert, debug } from 'console';
import * as fs from 'fs'
import { Point as p, Point, splitChunks, drawArrayOffSet, printGrid } from './utils'
let input = "input/day14-input-samp.txt"

const rawData: string[] = fs.readFileSync(input, 'utf8').split("\n");


type path = p[]
let d = rawData.map(line => line.split(" -> "));
let paths: path[] = d.map((pairs) => pairs.map(pr => (new p(Number(pr.split(',')[0]), Number(pr.split(',')[1])))));

const line = (p1: p, p2: p): p[] => {
    if (!p2)
        return [p1];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    let r: p[] = [];

    r.push(p1, p2)
    for (let x = 1; x < Math.abs(dx); x++)
        r.push(p1.addX(Math.sign(dx) * x));
    for (let y = 1; y < Math.abs(dy); y++)
        r.push(p1.addY(Math.sign(dy) * y))
    return r;
}

//make lines

let allRocks: p[] = paths.flatMap((path) => path.flatMap((p1, i) => line(p1, path[i + 1])));
const start = new p(500, 0);
let sand: p = start.clone();

const moveSand = (rocks: p[], floor: boolean = false, floorY: number = -1): boolean => {
    const p2 = sand.addY(1);
    const left = sand.add(-1, +1);
    const right = sand.add(+1, +1);
    const hitFloor = (p: p) => floor && p.y == floorY;
    if (rocks.some(r => r.equals(p2)) || hitFloor(p2)) { //would overlap, try left        

        if (!rocks.some(r => r.equals(left)) && !hitFloor(left)) { //would overlap, try left
            sand = left;
            return true;
        }
        if (!rocks.some(r => r.equals(right)) && !hitFloor(right)) { //would overlap, try left
            sand = right;
            return true;
        }
        return false;

    }
    if (!rocks.some(r => r.x == p2.x && r.y > p2.y) && !floor) { //fall to abism (only without floor)        
        return false;
    }

    //moving down
    if (!floor || p2.y < floorY) {
        sand = p2;
        return true;
    }
    else return false;
}

const moveSandOpt1 = (rocks: p[], floor: boolean = false, floorY: number = -1): boolean => {
    const p2 = sand.addY(1);
    const left = sand.add(-1, +1);
    const right = sand.add(+1, +1);
    const hitFloor = (p: p) => floor && p.y == floorY;

    const flag = rocks.reduce((a, b) =>
        a *= b.equalsInt(p2, 3) *
        b.equalsInt(left, 5) *
        b.equalsInt(right, 7), 1);

    if (flag % 3 == 0 || hitFloor(p2)) { //would overlap, try left        

        if (flag % 5 != 0 && !hitFloor(left)) { //would overlap, try left
            sand = left;
            return true;
        }
        if (flag % 7 != 0 && !hitFloor(right)) { //would overlap, try left
            sand = right;
            return true;
        }
        return false;

    }
    if (!rocks.some(r => r.x == p2.x && r.y > p2.y) && !floor) { //fall to abism (only without floor)        
        return false;
    }

    //moving down
    if (!floor || p2.y < floorY) {
        sand = p2;
        return true;
    }
    else return false;
}
const moveSandOpt2 = (rocks: Map<number,number[]>, floor: boolean = false, floorY: number = -1): boolean => {
    const p2 = sand.addY(1);
    const left = sand.add(-1, +1);
    const right = sand.add(+1, +1);
    const hitFloor = (p: p) => floor && p.y == floorY;
    
    const has =(p:p) => rocks.has(p.x) && rocks.get(p.x)?.some(y=>y==p.y);

    if (has(p2) || hitFloor(p2)) { //would overlap, try left        

        if (!has(left) && !hitFloor(left)) { //would overlap, try left
            sand = left;
            return true;
        }
        if (!has(right) && !hitFloor(right)) { //would overlap, try left
            sand = right;
            return true;
        }
        return false;

    }
    const hasSomeBelow = (p:p) => rocks.has(p2.x) && rocks.get(p2.x)?.some(y => y > p.y)
    if (!hasSomeBelow(p2) && !floor) { //fall to abism (only without floor)        
        return false;
    }

    //moving down
    if (!floor || p2.y < floorY) {
        sand = p2;
        return true;
    }
    else return false;
}

let r0 = allRocks.length;
let allResting: p[] = []
allRocks.forEach(r => r.c = "#");
/*
for (let i = 0; i < 1500; i++) {    
    while (moveSand(allRocks)) {

    }
    if (!allRocks.some(r => r.x == sand.x && r.y > sand.y))
        break;
    allRocks.push(sand.setC("#"))
    allResting.push(sand.setC("o"))
    //drawArrayOffSet([...allRocks,...allResting], start);
    sand = start.clone()
}
drawArrayOffSet([...allRocks, ...allResting], start);
console.log("Resting sand count (part 1)", allRocks.length - r0); //1133
*/



//Part 2:

const floorY = 2 + Math.max(...allRocks.map(r => r.y));
console.log("Floor position (y)", floorY);
allRocks = paths.flatMap((path) => path.flatMap((p1, i) => line(p1, path[i + 1])));
allRocks.forEach(r => r.c = "#");
allResting = [];
r0 = allRocks.length;

let b = drawArrayOffSet(allRocks);
fs.writeFileSync("day14-start.txt", b);

let allRocksMap = new Map<number,number[]>()
allRocks.forEach(v =>  allRocksMap.set(v.x, []));
allRocks.forEach(v =>  allRocksMap.get(v.x)?.push(v.y));
//trying to optmize stuff
let startT = Date.now();
for (let i = 0; i < 160*160*10; i++) {
    if (i % 100 == 0)
        console.log(`Part 2 i=${i} Resting: ${allRocks.length - r0}`);
    while (moveSandOpt2(allRocksMap, true, floorY)) {

    };
    sand.setC("#")
    const v = allRocksMap.get(sand.x) || []
    allRocksMap.set(sand.x,v.concat(sand.y))
    sand.setC("o")
    
    allResting.push(sand);

    //part 2 ends when is full
    if (start.equals(sand)) {
        const grid = [...allRocks, ...allResting];
        const maxX = Math.max(...grid.map(i => i.x)), minX = Math.min(...grid.map(i => i.x));
        //floor
        const f = line(new p(minX, floorY), new p(maxX, floorY));
        f.forEach(p => p.setC("ä"))
        grid.push(...f);

        let b = drawArrayOffSet(grid);
        fs.writeFileSync("day14-final.txt", b);
        break;
    }
    sand = start.clone();
}
let endT = Date.now();
console.log("Duration:", endT - startT);
let t = 0;
allRocksMap.forEach(v => t += v.length)
console.log("Resting sand count (part 2)", ); //27566
assert(27566 == t - r0)