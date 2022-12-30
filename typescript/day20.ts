import { assert, Console } from 'console';
import * as fs from 'fs'
import { removeAllListeners } from 'process';

import { Range } from '../lib/Range'
let input = "input/day20-input-samp.txt";


const rawData: number[] = fs.readFileSync(input, 'utf8').split("\n").map(s => Number(s));
//console.log("input", rawData)


type n_p = { ix: number, v: number };

type selectorFunc = (n_p) => number;

let mix = (input: n_p[]): n_p[] => {

    let out = input.slice();
    const N = input.length - 1;

    for (let i = 0; i < input.length; i++) {

        let nextIx = out.findIndex(e => e.ix == i);

        if (nextIx < 0)
            throw "Ooops"

        let next = out[nextIx];
        out.splice(nextIx, 1);//remove
        //negative should loop: there is a smarter way but I couldnt figure it out
        let newPos = 0;
        if (next?.v < 0)
            newPos = (next?.v % N) + N; //(N=6)
            1, 2, -2, -3, 0, 3, 4 => 1  (ix=2, v=-2)
            1, 2, -3, 0, 3, 4, -2 => 5  (N - (ix - v) )

        else newPos = (nextIx + next?.v) % N;

        out.splice(newPos, 0, next);//insert
        console.log(`reorder of ${next.v} \t\t ${out.map(o => o.v)}`)
    }
    return out;
}
let coord = (ordered: n_p[]): number[] => {
    const n = ordered.length;
    const z0 = ordered.findIndex(o => o.v == 0);
    const coord = Range.from(1, 4).map(v => ordered[(z0 + v * 1000) % n].v);
    return coord;
}

//Then, the grove coordinates can be found by looking at the 1000th, 
//2000th, and 3000th numbers after the value 0, wrapping around the list as necessary.
const original = rawData.map((v, ix) => ({ ix: ix, v: v }));
const unorder = original.slice();
const part1 = mix(unorder);
const coord1 = coord(part1);
const sol1 = coord1.reduce((a, b) => a + b, 0);

console.log("Coordinates part 1", coord1); //7255 too low
console.log("Solution part 1", sol1); //7255 too low
//assert(sol1==17490)

//part 2
console.log("********************************************************")
console.log("********************* PART 2 ***************************")
console.log("********************************************************")

const key = 811589153;
let unordered = original.map((v, ix) => ({ ix: ix, v: v.v * key }));
console.log(unordered.slice(0, 8).map(v => v.v))
const part2 = mix(unordered);

console.log("After mixing", part2.slice(0, 8).map(v => v.v))