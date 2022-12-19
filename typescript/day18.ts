import { assert } from 'console';
import * as fs from 'fs'
import { Point as p, drawArrayOffSet } from './utils'
import { Range } from '../lib/Range'
import Graph from '../lib/Graph';
import { WeightedGraph } from '../lib/WeightedGraph';
import { Piece } from './piece';
import { bitsToString, isBitSet } from '../lib/Binary';
import { compileFunction } from 'vm';
let input = "input/day18-input-samp.txt";

const inputLines: string[] = fs.readFileSync(input, 'utf8').split("\n");
const cubesArr: number[][] = inputLines.map(s => s.split(",").map(s => Number(s) + 1));

const coordToNumber = (arr: number[]) => (arr[2] << 16) | (arr[1] << 8) | (arr[0]);
const cubes: number[] = cubesArr.map(arr => coordToNumber(arr))

const x = (c: number) => (c & 0xFF);
const y = (c: number) => (c >> 8 & 0xFF);
const z = (c: number) => (c >> 16);

//checking the bit conversion: 
//assert(cubes.every((c, ix) => [x(c), y(c), z(c)].join(",") == inputLines[ix]))

//cubes share a face when 2 coordinates are the same
const equalsInt = (a: number, b: number) => Number(a == b);
const shareAFace = (a: number, b: number) => {
    return (equalsInt(x(a), x(b)) + equalsInt(y(a), y(b)) + equalsInt(z(a), z(b))) == 2 &&
        (Math.abs(x(a) - x(b)) + Math.abs(y(a) - y(b)) + Math.abs(z(a) - z(b))) == 1
};

//const commonFaces = cubes.reduce((t, c, ix) => t + cubes.slice(ix+1).filter(cb => same(c,cb)).length,0);
const commonFaces = cubes.reduce((t, c, ix) => t + cubes.filter(cb => shareAFace(c, cb)).length, 0);

const addX = (xyz: number, d: number) => (xyz + d);
const addY = (xyz: number, d: number) => (xyz + (d << 8));
const addZ = (xyz: number, d: number) => (xyz + (d << 16));

const t = cubes.length * 6;
console.log("Totals cubes", cubes.length)
console.log("Totals faces", t)
console.log("Common faces", commonFaces)
console.log("Part 1 - faces that aren't connected", t - commonFaces)
//assert( (t-commonFaces) == 4628)

//part 2, pockets of air
//brute forcec
let pocketCount = 0, cubeCount = 0;
let pocketCells: number[] = []
let [xs, ys, zs] = [cubes.map(c => x(c)), cubes.map(c => y(c)), cubes.map(c => z(c))];
const b=2;
const [minX, maxX, minY, maxY, minZ, maxZ] = [Math.min(...xs)-b, Math.max(...xs)+b, Math.min(...ys)-b, Math.max(...ys)+b, Math.min(...zs)-b, Math.max(...zs)+b];

//flood fill
const adj = (p: number) => cubes.findIndex(cb => shareAFace(p, cb)) > 0;
let countFaces = 0;
const countFacesRec = (p: number) => {
  
    if (z(p) > maxZ || x(p) > maxX || y(p) > maxY ||
        z(p) < minZ || x(p) < minX || y(p) < minY)
        return;

    const l = (t: number, f: Function, arg: number) => {
        if (adj(f(t, arg))) {
            cubes.push(f(t,arg));
            countFaces++;
        }
        else countFacesRec(f(t, arg));
    };
    l(p, addY, +1);
    l(p, addY, -1);
    l(p, addX, +1);  
    l(p, addX, -1);
    l(p, addZ, +1);
    l(p, addZ, -1);
    
}
/*
Range.from(minX - 1, maxX + 1).forEach(
    x => Range.from(minY - 1, maxY + 1).forEach(
        y => Range.from(minZ - 1, maxZ + 1).forEach(z => {
            let test = coordToNumber([x, y, z]);
            if (cubes.indexOf(test) >= 0) //there is a cube at the coordinates
                cubeCount++; //for debugging

            else if (cubes.filter(cb => shareAFace(cb, test)).length == 6) // it is a pocket!
                pocketCells.push(test);
        }
        )
    )
);
*/

//discount cubes that share a face with pockets
//pocketCount = pocketCells.reduce((t, c) => (pocketCells.filter(cb => shareAFace(c, cb)).length==6) ? t: t +1,0);

countFacesRec(0);

console.log("Number of faces hit (rec. algo.)", countFaces)
console.log("number of air pockets", pocketCount)
console.log("number of cubes", cubeCount)
console.log("Part 2 - surface area ", t - commonFaces - pocketCount * 6) //4316 too low; 4628 too high

