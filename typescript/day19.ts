import * as fs from 'fs'
import { Range } from '../lib/Range'
let input = "input/day19-input.txt"; let y = 2000000;
//let input = "input/day15-input-samp.txt" ;let y = 10;

const rawData: string[] = fs.readFileSync(input, 'utf8').split("\n");


const regexpSize = /Each ore robot costs ([0-9]+) ore. Each clay robot costs ([0-9]+) ore. Each obsidian robot costs ([0-9]+) ore and ([0-9]+) clay. Each geode robot costs ([0-9]+) ore and ([0-9]+) obsidian./gm;

//Each ore robot costs 4 ore. Each clay robot costs 2 ore.
let blueprints: robot[][] = []
const stuff = rawData.forEach((l, i) => {
    let ms = [...l.matchAll(regexpSize)];
    const c0 = Number(ms[0][1]);
    const c1 = Number(ms[0][2]);
    const c2 = Number(ms[0][3]);
    const c3 = Number(ms[0][4]);
    const c4 = Number(ms[0][5]);
    const c5 = Number(ms[0][6]);

    const bot1: robot = { cost: [c0, 0, 0] }
    const bot2: robot = { cost: [c1, 0, 0] }
    const bot3: robot = { cost: [c2, c3, 0] }
    const bot4: robot = { cost: [c4, 0, c5] }
    blueprints.push([bot1, bot2, bot3, bot4]);
});




type produceFunc = (balances: number[]) => number;

type robot = { cost: number[] };

/**
 * Determines if there is enough balance to build a new robot.
 */
const balanceCheck = (balanceAvailable: number[], ...costs: number[]): boolean => {
    const [oreCost, ClayCost, obsidianCost] = costs;
    return (balanceAvailable[0] >= oreCost) &&
        (ClayCost === undefined || balanceAvailable[1] >= ClayCost) &&
        (obsidianCost === undefined || balanceAvailable[2] >= obsidianCost);
};



function shouldProduce(blueprint: robot[], robots: number[], robotToProduceIx: number): boolean {
    //find the max consumption for robot
    let maxConsumption = Math.max(...blueprint.map((r) => r.cost[robotToProduceIx]));

    //do we already have enough robots to produce that?
    //if so, then do not produce more
    if (robots[robotToProduceIx] >= maxConsumption)
        return false;

    return true;
}

function* factory(balanceAvailable: number[], state: state, blueprint: robot[]) {
    //it can only build one robot at a time!
    //because of that, there shouldn't be more 
    //producers than it is possible to consume
    let result: state[] = [];


    for (let i = 0; i < blueprint.length; i++) {
        let ix = i;//blueprint.length - 1 - (i + state.last) % blueprint.length;
        const robot = blueprint[ix];

        if (balanceCheck(balanceAvailable, ...robot.cost)
            && shouldProduce(blueprint, state.robots, ix)) {
            const newState: state = { balances: state.balances.slice(), robots: state.robots.slice(), last: ix };
            robot.cost.forEach((cost, cix) => newState.balances[cix] -= cost);
            newState.robots[ix]++;
            yield newState;
        }
    }
    return;
}

type state = { balances: number[], robots: number[], last: number }

function* simulator(blueprint: robot[], t: number, duration: number, state: state) {
    if (t == duration) {
        if (state.balances[3] > 1)
            yield { balances: state.balances, robots: state.robots, t: t };
        //yield state.balances;
        return;
    }
    if (t == duration - 1 && state.balances[3] == 0) {
        return;
    }

    const balancePreCollection = state.balances.slice();

    state.robots.forEach((n, rix) => state.balances[rix] += n);

    for (const newState of factory(balancePreCollection, state, blueprint)) {
        yield* simulator(blueprint, t + 1, duration, newState);
    }

    yield* simulator(blueprint, t + 1, duration, { balances: state.balances.slice(), robots: state.robots.slice(), last: 0 });
    return;

    if (debug) {
        console.log("At t = ", t)
        console.log("\tRobots (ore,clay,obs.geo)\t", state.robots)
        console.log("\tBalances (ore,clay,obs.geo)\t", state.balances);
    }


}


//Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
/*
let robotOre: robot = { cost: [4, 0, 0], };
let robotClay: robot = { cost: [2, 0, 0] };
let robotObsidian: robot = { cost: [3, 14, 0] };
let robotGeode: robot = { cost: [2, 0, 7] };

*/
let robotOre: robot = { cost: [2, 0, 0] };
let robotClay: robot = { cost: [3, 0, 0] };
let robotObsidian: robot = { cost: [3, 8, 0] };
let robotGeode: robot = { cost: [3, 0, 12] };



let debug = false;

console.log("Simulating blueprints...")

blueprints.forEach((blueprint, i) => {
    let allBots: number[] = new Array(4).fill(0);

    console.log("Blueprint ", i+1)

    allBots[0] = 1; // you start with 1 ore robot
    let state0: state = { balances: new Array(4).fill(0), robots: allBots, last: 0 }
    let sim = simulator(blueprint, 0, 24, state0);
    let sol = sim.next();
    let ceiling = 0;
    let maxGeode = 0;

    while (!sol.done && ceiling < 1e12) {
        //console.log("Sol", sol.value.balances, sol.value.robots);
        if (sol.value.balances[3] > maxGeode) {
            console.log(">>>>> Sol", sol.value.balances, sol.value.robots);
            maxGeode = sol.value.balances[3];
        }
        ceiling++;
        sol = sim.next();
    }
    //console.log(`Max geodes for blueprint ${i}`, maxGeode);
    console.log(`Quality level for blueprint ${i}`, (i+1)*maxGeode);

});

