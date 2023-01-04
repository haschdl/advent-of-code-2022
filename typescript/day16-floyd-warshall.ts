import { FloydWarshall, Edge } from 'floyd-warshall-shortest';
import * as fs from 'fs'
import { Range } from '../lib/Range'
import { WeightedGraph } from '../lib/WeightedGraph';
const input = "input/day16-input-samp.txt";
//let input = "input/day15-input-samp.txt" ;let y = 10;

const rawData: string[] = fs.readFileSync(input, 'utf8').split("\n");

const nValves = rawData.length;

const flowRates: number[] = new Array(nValves);
const edgesString: string[][] = new Array(nValves);
const edgesNames: string[] = new Array(nValves);
const edges: number[][] = new Array(nValves);

const regexpSize = /Valve ([A-Z]{2}) has flow rate=(-?[0-9]+); tunnel(?:s)? lead(?:s)? to valve(?:s)? (.*)/gm;
rawData.forEach((l, i) => {
    const ms = [...l.matchAll(regexpSize)];
    edgesNames[i] = ms[0][1];
    flowRates[i] = Number(ms[0][2]);
    edgesString[i] = ms[0][3].split(", ");
});

edgesString.forEach((ls, i) => edges[i] = ls.map(s => edgesNames.indexOf(s)));

//trying something crazy: if a valve can be opened, add a new fake node, with *
//to account for the valve that releases pressure
Range.from(0, flowRates.length).forEach(i => {
    if (flowRates[i] > 0) {
        const newIx = flowRates.push(0) - 1; //push returns new lenght;
        edgesNames.push(edgesNames[i]);
        edgesNames[i] += "*";

        edges.forEach(l => { if (l.includes(i)) l.push(newIx) });
    }
});

const edgesUnique: number[][] = new Array(edgesNames.length).fill(0).map(e => []);
edges.map((vEdges, from) => vEdges.forEach(to => {
    if (edgesUnique[to].includes(from))
        return;
    edgesUnique[from].push(to);
}));


//graph approach 2: from node A to B, there are 2 possibilities: 
// go to B and open B (cost = 1 + 1 / (1 + flowRateB))
// go to B and not open B (cost = 1)
const edgesFloydWarshall: Edge<number>[] = []
edgesUnique.forEach((vEdges, from) =>
    vEdges.forEach(to => {
        edgesFloydWarshall.push({ from: from, to: to, weight: 1000 - flowRates[to] }); //cost of going to "to" and *opening* valve

    })
);

const graph = new FloydWarshall(edgesFloydWarshall, false); // undirected edges!!!

const path = graph.getShortestVisitingPath(Range.from(0, 9));
console.log(path)