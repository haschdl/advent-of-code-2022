"use strict"

import { SlowBuffer } from 'buffer';
import * as fs from 'fs';
import { join } from 'path';
import Graph from '../utils/graph';
import { printGrid, splitChunks } from './utils';
let input = "input/day12-input.txt"

type p = [number, number];//x,y

const ch = (c: string): number => c.charCodeAt(0);
const rawData: string[][] = fs.readFileSync(input, 'utf8').split("\n").map(i => i.split(""));
const ny = rawData.length, nx = rawData[0].length;
const heights = rawData.map(r => r.map(o => ch(o)));

const debug = false;

const findChar = (char: string): p => {
    let x = 0;
    let y = rawData.findIndex((row, ix) => { x = row.findIndex(v => v === char); return x >= 0 });
    return [x, y] as p;
}

const start: p = findChar("S");
const end: p = findChar("E");

//updateheighs = Your current position (S) has elevation a, and the location that should get 
heights[start[1]][start[0]] = ch("a")
heights[end[1]][end[0]] = ch("z")
const heightsArr = heights.flatMap(m => m);

const h = (p: p): number => heights[p[1]][p[0]]

const canMove = (from: p, to: p) => h(to) - h(from) <= 1;// && dist(to,end) <= dist0;

const moves = (p: p): p[] => {
    const dirs = ["<", ">", "^", "v"]
    const neigh: p[] = splitChunks([-1, 0, 1, 0, 0, 1, 0, -1], 2); //no diag.
    let r: p[] = [];
    neigh.forEach((v) => r.push([p[0] + v[0], p[1] + v[1]]));
    r = r.filter(r => r[0] >= 0 && r[0] < nx && r[1] >= 0 && r[1] < ny);
    return r.filter(r => p && r && canMove(p, r));
}

const p_of_ix = (ix: number): p => [ix % nx, Math.floor(ix / nx)]
const ix_of_p = (p: p) => p[1] * nx + p[0] //y*nx + x
const movesIx = (ix: number): number[] => moves(p_of_ix(ix)).map(p => ix_of_p(p));

const g = new Graph();

heightsArr.forEach((_, ix) => g.addVertex(ix));
heightsArr.forEach((_, vix) => movesIx(vix).forEach((wix) => g.addEdge(vix, wix)));

const startIx = ix_of_p(start);
const goalIx = ix_of_p(end);

const solution1 = g.bfs(goalIx, startIx)
console.log("Solution part 1", solution1)


//Part 2
const starts: number[] = [];
heightsArr.forEach((h, ix) => { if (h == ch('a')) starts.push(ix) });

const solutionsPart2: number[] = [];
starts.forEach((startIx, i) => {
    const goalIx = ix_of_p(end);
    const solution2 = g.bfs(goalIx, startIx);
    if (solution2 !== false) {
        console.log(`Partial solution for part 2 (${i}/${starts.length})`, solution2.distance);
        solutionsPart2.push(solution2.distance);
    }
});

console.log("Solution part 2", Math.min(...solutionsPart2))
