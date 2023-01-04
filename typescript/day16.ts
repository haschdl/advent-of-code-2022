import * as fs from 'fs'
import { FloydWarshall, Edge } from 'floyd-warshall-shortest';
import { assert } from 'console';
const input = "input/day16-input.txt";
//let input = "input/day15-input-samp.txt" ;let y = 10;

const rawData: string[] = fs.readFileSync(input, 'utf8').split("\n");

const nValves = rawData.length;

const flowRates: number[] = new Array(nValves);
const edgesString: string[][] = new Array(nValves);
const nodeNames: string[] = new Array(nValves);
const edges: number[][] = new Array(nValves);

const regexpSize = /Valve ([A-Z]{2}) has flow rate=(-?[0-9]+); tunnel(?:s)? lead(?:s)? to valve(?:s)? (.*)/gm;
rawData.forEach((l, i) => {
    const ms = [...l.matchAll(regexpSize)];
    nodeNames[i] = ms[0][1];
    flowRates[i] = Number(ms[0][2]);
    edgesString[i] = ms[0][3].split(", ");
});

edgesString.forEach((ls, i) => edges[i] = ls.map(s => nodeNames.indexOf(s)));



type p = { time: number, v: number }
const partialRelease = (steps: step[]) => {

    const partials: p[] = [];

    const openValves = new Set<number>();
    partials.push({ time: 0, v: 0 });
    openValves.add(0);
    for (let t = 1; t <= 30; t += 1) {

        const nextStep = steps.find(step => step.atTime == t);
        if (nextStep == undefined || openValves.has(nextStep.valveOpen)) {
            partials.push({ time: t, v: partials.slice(-1)[0].v });//continues with the same rate as previous minute
            continue;
        }
        if (nextStep && !openValves.has(nextStep.valveOpen)) {

            // this is a new valve to be opened
            openValves.add(nextStep.valveOpen);
            const part = Array.from(openValves);
            partials.push({ time: t, v: partials.slice(-1)[0].v });//continues;
            if (flowRates[nextStep.valveOpen] > 0) {
                partials.push({ time: t + 1, v: part.reduce((a, b) => a + flowRates[b], 0) });
                t += 1;
            }
            continue;
        }
    }
    return partials;
}

const totalRelease = (steps: step[], totalTime: number) => {
    return steps.reduce((t, s) => t += Math.max(totalTime - s.atTime, 0) * flowRates[s.valveOpen], 0);
}

type step = { valveOpen: number, atTime: number }


function* getPathsFloydMarshall(steps: step[], lastValveOpen: number, nodesToVisit: number[], time: number) {
    if (nodesToVisit.length === 0 || time >= 30) {
        yield steps;
        return;
    }

    for (const node of nodesToVisit) {
        //getShortestDistanceCached(lastValveOpen, node)
        const cost = shortestDistances[lastValveOpen * N + node] + 1;// graph.getShortestDistance(lastValveOpen, node) + 1;
        if (time + cost >= 30)
            yield steps;

        const step = { valveOpen: node, atTime: time + cost };

        const nextPaths = getPathsFloydMarshall([...steps, step], step.valveOpen, nodesToVisit.filter(n => n !== node), time + cost);
        for (const pathTime of nextPaths)
            yield pathTime;
    }
}


function* getPathsFloydMarshallTwo(steps: step[], lastValveOpen1: number, lastValveOpen2: number, nodesToVisit: number[], time1: number, time2: number) {
    if (nodesToVisit.length > 0 && time1 >= 30 && time2 >= 30) {
        yield steps;
        return;
    }

    if (nodesToVisit.length === 0 || (lastValveOpen1 == -1 && lastValveOpen2 == -1)) {
        yield steps;
        return;
    }

    //let nextPaths;

    for (let i = 0; i < nodesToVisit.length; i += 1) {



        if (lastValveOpen1 >= 0) {
            const node1 = nodesToVisit[i];
            const cost1 = shortestDistances[lastValveOpen1 * N + node1] + 1;
            const step1 = { valveOpen: node1, atTime: time1 + cost1 };

            if (lastValveOpen2 >= 0) {
                const otherNodes = nodesToVisit.filter(n => n != node1);
                for (let j = 0; j < otherNodes.length; j += 1) {
                    const node2 = otherNodes[j];
                    const cost2 = shortestDistances[lastValveOpen2 * N + node2] + 1;// graph.getShortestDistance(lastValveOpen, node) + 1;  
                    const step2 = { valveOpen: node2, atTime: time2 + cost2 };

                    /*
                    if ((time1 + cost1) >= 30 && (time2 + cost2) >= 30) {
                        yield steps;
                        continue;
                    }*/

                    if ((time1 + cost1) <= 30 && (time2 + cost2) <= 30) //both continue
                        yield* getPathsFloydMarshallTwo([...steps, step1, step2], step1.valveOpen, step2.valveOpen, nodesToVisit.filter(n => n !== node1 && n != node2), time1 + cost1, time2 + cost2);
                    else if (time2 + cost2 <= 30)  //only 2 continues, 1 discarded
                        yield* getPathsFloydMarshallTwo([...steps, step2], -1, step2.valveOpen, nodesToVisit.filter(n => n != node2), time1, time2 + cost2);
                    /*
                    if (nextPaths)
                        for (const pathTime of nextPaths)
                            yield pathTime;
                            */
                }
            }
            else {//it is only node1/cost2
                yield* getPathsFloydMarshallTwo([...steps, step1], step1.valveOpen, -1, nodesToVisit.filter(n => n !== node1), time1 + cost1, time2);
                /* for (const pathTime of nextPaths)
                     yield pathTime;
                     */
            }
        }
        else if (lastValveOpen2 >= 0) { //lastValveOpen1 is -1
            const node2 = nodesToVisit[i];
            const cost2 = shortestDistances[lastValveOpen2 * N + node2] + 1;

            if (time2 + cost2 >= 30) {
                yield steps;
                continue;
            }
            const step2 = { valveOpen: node2, atTime: time2 + cost2 };
            yield* getPathsFloydMarshallTwo([...steps, step2], -1, step2.valveOpen, nodesToVisit.filter(n => n != node2), time1, time2 + cost2);

            /*for (const pathTime of nextPaths)
                yield pathTime;*/

        }
        else return; //both -1
    }
}



//edges should not repeat
const edgesUnique: number[][] = new Array(nodeNames.length).fill(0).map(() => []);
edges.map((vEdges, from) => vEdges.forEach(to => {
    if (edgesUnique[to].includes(from))
        return;
    edgesUnique[from].push(to);
}));

//Range.from(0, edgesUnique.length).forEach(i => graph.addVertex(i))


//graph approach 2: from node A to B, there are 2 possibilities: 
// go to B and open B (cost = 1 + 1 / (1 + flowRateB))
// go to B and not open B (cost = 1)
const edgesFloydWarshall: Edge<number>[] = []
edgesUnique.forEach((vEdges, from) =>
    vEdges.forEach(to => {
        edgesFloydWarshall.push({ from: from, to: to, weight: 1 }); //cost of going to "to" and *opening* valve
    })
);

const graph = new FloydWarshall(edgesFloydWarshall, false); // undirected edges!!!

const N = flowRates.length;
const shortestDistances: Uint16Array = new Uint16Array(N * N);

//const shortestDistances: number[][] = new Array(flowRates.length).fill(0).map(e => new Array(flowRates.length));
for (let from = 0; from < N; from++) {
    for (let to = 0; to < N; to++) {
        const ix = from * N + to;
        shortestDistances[ix] = graph.getShortestDistance(from, to);
    }
}

const valve0 = nodeNames.findIndex(n => n == "AA");


// Part 1: one person visiting nodes
function part1() {
    const nodesToVisit0: number[] = flowRates.reduce((m, v, i) => (v > 0 && m.push(i), m), [] as number[]);
    nodesToVisit0.sort((a, b) => flowRates[b] - flowRates[a]);


    const sols = getPathsFloydMarshall([{ valveOpen: valve0, atTime: 0 }], valve0, nodesToVisit0, 0);
    let sol = sols.next();
    let perm = sol.value;
    let finalSol = sol.value;
    let maxRelease = -Infinity;
    let it = 0;
    while (!sol.done) {

        //const release = partialRelease(sol.value).reduce((a, b) => a + b.v, 0);
        const release = totalRelease(sol.value, 30);
        it++;
        if (it % 1000000 == 0)
            console.log("Iterations", it)
        if (release > maxRelease) {
            perm = sol.value;
            maxRelease = release;
            finalSol = sol.value;
            const p = perm.map(i => nodeNames[i.valveOpen]);

            console.log(`${it}\tValves open: ${p.join(",")} Total release: ${maxRelease}`);
            // const partialReleases = partialRelease(sol.value);console.log(`Partial releases: ${partialReleases} Sum of partial: ${partialReleases.reduce((a, b) => a + b.v, 0)}`);
        }
        sol = sols.next();
    }

    //2471 too high
    console.log("Number of iterations until max", it)
    console.log("Part 1 - Max release at t=30", maxRelease)
    //assert()
}
part1();

// Part 2: you and the elephant
const part2 = () => {

    const nodesToVisit0: number[] = flowRates.reduce((m, v, i) => (v > 0 && m.push(i), m), [] as number[]);
    nodesToVisit0.sort((a, b) => flowRates[b] - flowRates[a]);

    const sols = getPathsFloydMarshallTwo([{ valveOpen: valve0, atTime: 4 }], valve0, valve0, nodesToVisit0, 4, 4);
    let sol = sols.next();
    let perm = sol.value;
    let finalSol = sol.value;
    let maxRelease = -Infinity;
    let it = 0;
    while (!sol.done) {

        //const release = partialRelease(sol.value).reduce((a, b) => a + b.v, 0);
        const release = totalRelease(sol.value, 30);
        it++;
        if (it % 5000000 == 0) {
            console.log(`It ${it.toLocaleString()} Total release: ${totalRelease(sol.value, 30)}`);
        }
        if (release > maxRelease) {
            perm = sol.value;
            maxRelease = release;
            finalSol = sol.value;
            const p = perm.map(i => nodeNames[i.valveOpen]);

            console.log(`${it}\tValves open: ${p.join(",")} Total release: ${maxRelease}`);
            // const partialReleases = partialRelease(sol.value);console.log(`Partial releases: ${partialReleases} Sum of partial: ${partialReleases.reduce((a, b) => a + b.v, 0)}`);
        }
        sol = sols.next();
    }
    //2824 after 1 900 217 564 iterations. very slow!
    console.log("Number of iterations until max", it)
    console.log("Part 2 - Max release at t=30", maxRelease)

}
part2();

