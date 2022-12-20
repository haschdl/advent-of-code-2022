/**
 * This solution uses bit shift operations that will work as expected 
 * for negative numbers. This is why I offset all coordinates by 5
 */
import { assert } from 'console';
import * as fs from 'fs'
let input = "input/day18-input.txt";

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

let [xs, ys, zs] = [cubes.map(c => x(c)), cubes.map(c => y(c)), cubes.map(c => z(c))];
const b = 1;
const [minX, maxX, minY, maxY, minZ, maxZ] = [Math.min(...xs) - b, Math.max(...xs) + b, Math.min(...ys) - b, Math.max(...ys) + b, Math.min(...zs) - b, Math.max(...zs) + b];

//flood fill
const adj = (p: number) => cubes.filter(cb => shareAFace(p, cb));
let countFaces = 0;
let faces: number[] = [];
let cubesVisit: Set<number> = new Set();
const countFacesRec = (p: number) => {

    if (z(p) > maxZ || x(p) > maxX || y(p) > maxY ||
        z(p) < minZ || x(p) < minX || y(p) < minY)
        return;

    const l = (cub1: number, cub2: number) => {

        let adjFace = (cub1 << 32) + cub2;
        if (faces.indexOf(adjFace) == -1) {
            faces.push(adjFace);


            if (cubes.some(c => c == cub2)) {//shares a face with cub2 
                cubesVisit.add(cub2);
                countFaces++;
            }
            else
                countFacesRec(cub2);
        }

    };


    l(p, addX(p, +1));
    l(p, addY(p, +1));
    l(p, addZ(p, +1));

    l(p, addX(p, -1));
    l(p, addY(p, -1));
    l(p, addZ(p, -1));

}

console.log("Trying recursive algo")
countFacesRec(0);

console.log("Part 2 - number of faces hit (rec. algo.)", countFaces)
assert(countFaces == 2582)