import { assert, debug } from 'console';
import * as fs from 'fs'
import { Point as p, Point, splitChunks, drawArrayOffSet, printGrid } from './utils'
import { Range } from '../lib/Range'
import Graph from '../lib/Graph';
import { WeightedGraph } from '../lib/WeightedGraph';
let input = "input/day16-input-samp.txt"; let y = 2000000;
//let input = "input/day15-input-samp.txt" ;let y = 10;

const rawData: string[] = fs.readFileSync(input, 'utf8').split("\n");

const nValves = rawData.length;

const flowRates: number[] = new Array(nValves);
const edgesString: string[][] = new Array(nValves);
const edgesNames: string[] = new Array(nValves);
let edges: number[][] = new Array(nValves);

const regexpSize = /Valve ([A-Z]{2}) has flow rate=(-?[0-9]+); tunnel(?:s)? lead(?:s)? to valve(?:s)? (.*)/gm;
const stuff = rawData.forEach((l, i) => {
    let ms = [...l.matchAll(regexpSize)];
    edgesNames[i] = ms[0][1];
    flowRates[i] = Number(ms[0][2]);
    edgesString[i] = ms[0][3].split(", ");
});

edgesString.forEach((ls, i) => edges[i] = ls.map(s => edgesNames.indexOf(s)));

//console.log("Flow rates", flowRates); console.log("Edges", edges);

//heuristics: visit top releasing valves as soon as possible!
const topByIndex = flowRates.map((r, i) => ({ i: i, r: r })).sort((a, b) => b.r - a.r).map(c => c.i);
console.log("Top valves by flow rate", topByIndex);


const partialRelease = (path: number[]): number[] => {
    let sum = 0;
    type p={t:number,v:number}
    let partials: p[] = [];
    let pathC = path.slice(0);
    let open = new Set<number>();
    for (let t = 0; t <= 30; t += 1) {
        if (t == 0) {
            partials.push({t:t,v:0});
            open.add(0);
            continue;
        }
        let node = pathC.shift();
        if (node == undefined || open.has(node)) {
            partials.push({t:t, v:partials.slice(-1)[0].v});//continues;
            continue;
        }
        if (node && !open.has(node)) {
            open.add(node);
            const part = Array.from(open);
            partials.push({t:t, v:partials.slice(-1)[0].v});//continues;
            partials.push({t:t+1, v:part.reduce((a, b) => a + flowRates[b], 0)});
            t += 1;
            continue;
        }

    }

    return partials;
}


//wrong for [0,3,0,1,0,0,9,0,0,0,0,0,0,7,0,0,4,0,2] it should be 1651
const totalRelease = (path: number[]): number => {
    let sum = 0;
    let open = new Set<number>();
    let t = 30;
    for (let i = 0; i < path.length; i++) {
        const node = path[i];
        if (!open.has(node)) {
            t -=1;
            sum += t * flowRates[node];
        }
        
            t -= 1;
            open.add(node);
        
    }
    return sum;
}

function* getPaths(currPath: number[], edges: number[][], depth: number) {
    if (depth === 15) {
        yield currPath;
        return;
    }

    const last = currPath.slice(-1)[0];

    if (edges[last] === undefined || edges[last].length === 0) {
        yield currPath;
        return;
    }

    for (const edge of edges[last]) {
        let nextPaths = getPaths([...currPath, edge], edges, depth + 1);
        for (const path of nextPaths)
            yield path;

    }
}

//let paths = getPaths([0], edges, 0);
let graph = new WeightedGraph();
Range.from(0, nValves).forEach(i => graph.addVertex(i))

edges.forEach((vEdges, from) => vEdges.forEach(to => graph.addEdge(from, to, 1 / (flowRates[to]))));

const goalPredicate = (depth, _v) => depth == 6;

let sols = getPaths([0], edges, 0);

let sol = sols.next();
let maxRelease = -Infinity;
let it = 0;
while (!sol.done) {

    //perm = permutations of each valve: open or close
    //this would not work! 
    //best strategy is to seek first the high prio 
    //valves then continue to smaller ones!
    let perm = sol.value;
    const release = partialRelease(perm).reduce((a,b)=>a+b.v,0);
    it++;
    if (release > maxRelease) {
        maxRelease = release;
        const p = perm.map(i => edgesNames[i]);
        console.log(`${it}\tPath: ${p.join(", ")} Total release: ${release}`);
        //console.log(`Partial releases: ${partialRelease(sol.value)} Sum of partial: ${partialRelease(sol.value).reduce((a, b) => a + b, 0)}`);

    }
    sol = sols.next();
}
