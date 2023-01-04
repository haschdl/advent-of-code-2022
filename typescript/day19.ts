import { assert } from 'console';
import * as fs from 'fs'
import { Range } from '../lib/Range'
<<<<<<< HEAD
let input = "input/day19-input-samp.txt"; let y = 2000000;
=======
const input = "input/day19-input-samp.txt"; const y = 2000000;
>>>>>>> 0d6a82fa8aeafa9a8813e38ff5b85473038b4727
//let input = "input/day15-input-samp.txt" ;let y = 10;

const rawData: string[] = fs.readFileSync(input, 'utf8').split("\n");


const regexpSize = /Each ore robot costs ([0-9]+) ore. Each clay robot costs ([0-9]+) ore. Each obsidian robot costs ([0-9]+) ore and ([0-9]+) clay. Each geode robot costs ([0-9]+) ore and ([0-9]+) obsidian./gm;

//Each ore robot costs 4 ore. Each clay robot costs 2 ore.
const blueprints: robot[][] = []
const stuff = rawData.forEach((l, i) => {
    const ms = [...l.matchAll(regexpSize)];
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


/**
 * Costs of each resource to produce one robot.
 * cost[0] => ore to produce a new bot
 * cost[1] => clay consumed to produce a new bot
 * cost[2] => obsidian consumed to produce a new bot
 */
type robot = { cost: number[] };

/**
 * Determines if there is enough balance to build a new robot.
 */
const balanceCheck = (balanceAvailable: number[], costs: number[]): boolean => {
    return (balanceAvailable[0] >= costs[0]) &&
        (balanceAvailable[1] >= costs[1]) &&
        (balanceAvailable[2] >= costs[2]);
};

<<<<<<< HEAD
const maxGeod = (n:number,T:number) => {
    //the maximum theoretical production of geodes with T minutes left
    //and n geode producing robots at T 
    //is calculated with a arithmetic progression

    /**
     *  min left    =>  T       T-1     T-2     ...     T-i     0 (T==i)
     *  robots      =>  n       n+1     n+2
     *  output at i =>  0       n       n+1     ...     n+i-1   n+T-1
     * 
     *  total output = n*T + T*(T-1)/2
     */
    
    //
    return n*T + T*(T-1)>>1;
=======
/**
 * Theorical maximum number of geodes that can be produced
 * in a remaining time T.
 * @param n number of geode producing bots at T
 * @param T time left in the simulation
 */
const maxGeode = (n: number, T: number) => {
    return n * T + (T * (T - 1)) / 2;
>>>>>>> 0d6a82fa8aeafa9a8813e38ff5b85473038b4727
}

function shouldProduce(blueprint: robot[], state: state, robotToProduceIx: number, time_left: number): boolean {

<<<<<<< HEAD
function shouldProduceBot(blueprint: robot[], robots: number[], robotToProduceIx: number): boolean {
    //find the max consumption for robot
    let maxConsumption = Math.max(...blueprint.map((r) => r.cost[robotToProduceIx]));

    //do we already have enough robots to produce that?
    //if so, then do not produce more
    if (robots[robotToProduceIx] >= maxConsumption)
=======
    //for any resource R that is not geode (0-2), if there are X bots creating R, current stock of
    //Y, and T minutes left, and no robot requires more than Z of R, then you don't need to produce another robot
    //anymore if X*T >= T * Z
    const X = state.robot_counts[robotToProduceIx];
    const Y = state.balances[robotToProduceIx];
    const T = time_left;
    const Z = Math.max(...blueprint.map((r) => r.cost[robotToProduceIx]));
    if ((X * T + Y) >= (T * Z))
>>>>>>> 0d6a82fa8aeafa9a8813e38ff5b85473038b4727
        return false;

    return true;
}

/**
<<<<<<< HEAD
 * Updates state by creating new bots.
 * @param balanceAvailable 
 * @param state 
 * @param blueprint 
 * @returns 
 */
function* factory(balanceAvailable: number[], state: state, blueprint: robot[]) {
=======
 * Returns the time in the future when a robot can be produced,
 * given current robots.
 * @param blueprint 
 * @param state 
 * @param robotToProduceIx 
 * @param time_left 
 * @returns 
 */
function whenCanProduce(balanceAvailable: number[], blueprint: robot[], state: state, robotToProduceIx: number, time_left: number): number {

    //for any resource R that is not geode (0-2), if there are X bots creating R, current stock of
    //Y, and T minutes left, and no robot requires more than Z of R, then you don't need to produce another robot
    //anymore if X*T >= T * Z
    const X = state.robot_counts[robotToProduceIx];
    const Y = balanceAvailable[robotToProduceIx];
    const T = time_left;
    const Z = Math.max(...blueprint.map((r) => r.cost[robotToProduceIx]));
    if ((X * T + Y) >= (T * Z))
        return -1; // it should not produce any more robots of this type

    //delta to produce a new robot of index ix
    const c = blueprint[robotToProduceIx].cost;
    const b = balanceAvailable;

    const cost = (cost_to_produce: number, balance: number, robot_count: number) => (cost_to_produce == 0) ? 0 : (cost_to_produce - balance) / robot_count;

    const delta = Math.max(cost(c[0], b[0], state.robot_counts[0]), cost(c[1], b[1], state.robot_counts[1]), cost(c[2], b[2], state.robot_counts[2]));
    if (delta == Infinity || delta > time_left) {
        //cannot produce (some robot count is zero)
        //this can be smarter and could be an actual T where robot can be produced
        return 1;
    }
    else if (delta <= 0) {
        //should produce now
        return 0;
    }
    else {
        return Math.ceil(delta);
    }
}


function* factory(balanceAvailable: number[], state: state, blueprint: robot[], time_left: number) {
>>>>>>> 0d6a82fa8aeafa9a8813e38ff5b85473038b4727
    //it can only build one robot at a time!
    //because of that, there shouldn't be more 
    //producers than it is possible to consume


    for (let i = 3; i >= 0; i--) { //for each robot in a blueprint
        const ix = i;//blueprint.length - 1 - (i + state.last) % blueprint.length;
        const robot = blueprint[ix];

<<<<<<< HEAD
        if (balanceCheck(balanceAvailable, ...robot.cost)
            && shouldProduceBot(blueprint, state.robots, ix)) {
            const newState: state = { balances: state.balances.slice(), robots: state.robots.slice(), maxGeode: state.maxGeode };
            robot.cost.forEach((cost, cix) => newState.balances[cix] -= cost);
            newState.robots[ix]++;
=======
        // if (!balanceCheck(balanceAvailable, robot.cost))
        //   continue;


        const d = whenCanProduce(balanceAvailable, blueprint, state, ix, time_left);
        if (d == 0) { //it can produce another robot right now
            const newState: state = { balances: state.balances.slice(), robot_counts: state.robot_counts.slice(), delta: 1, maxGeode: state.maxGeode };
            newState.balances[0] -= robot.cost[0];
            newState.balances[1] -= robot.cost[1];
            newState.balances[2] -= robot.cost[2];
            newState.robot_counts[ix]++;
>>>>>>> 0d6a82fa8aeafa9a8813e38ff5b85473038b4727
            yield newState;
        }
        else if (d > 0) {
            yield { balances: state.balances.slice(), robot_counts: state.robot_counts.slice(), delta: d, maxGeode: state.maxGeode };
        }
    }
    return;
}

<<<<<<< HEAD
type state = { balances: number[], robots: number[], maxGeode: number }
=======
/**
 * State for each round of the simulation.
 * `balances` is the count of resources in the order: ore, clay, obsidian, geode.
 * `robots` is the number of bots in this order: ore, clay, obsidian, geode
 */
type state = { balances: number[], robot_counts: number[], delta: number, maxGeode: number }
>>>>>>> 0d6a82fa8aeafa9a8813e38ff5b85473038b4727

/**
 * 
 * @param blueprint 
 * @param delta 
 * @param time_left 
 * @param state 
 * @returns 
 */
function* simulator(blueprint: robot[], time_left: number, state: state) {
    if (time_left <= 0) {
        if (state.balances[3] > 0)
            yield { balances: state.balances, robots: state.robot_counts };
        return;
    }

    //if theoritical max is smaller than a previous state, return
    if (maxGeode(state.robot_counts[3], time_left) + state.balances[3] <= state.maxGeode)
        return;


    const balancePreCollection = state.balances.slice();
    const delta = state.delta;

<<<<<<< HEAD
    //each robot produces 
    state.robots.forEach((n, rix) => state.balances[rix] += n);
=======
    //increases balances according to the number of each robots
    state.balances[0] += delta * state.robot_counts[0];
    state.balances[1] += delta * state.robot_counts[1];
    state.balances[2] += delta * state.robot_counts[2];
    state.balances[3] += delta * state.robot_counts[3];
    state.maxGeode = Math.max(state.maxGeode, state.balances[3]);
>>>>>>> 0d6a82fa8aeafa9a8813e38ff5b85473038b4727

    //yield* simulator(blueprint, 1, time_left - 1, { balances: state.balances.slice(), robot_counts: state.robot_counts.slice(), delta: 1});

<<<<<<< HEAD
    yield* simulator(blueprint, t + 1, duration, { balances: state.balances.slice(), robots: state.robots.slice(), maxGeode: 0 });
    return;
=======
>>>>>>> 0d6a82fa8aeafa9a8813e38ff5b85473038b4727

    for (const newState of factory(balancePreCollection, state, blueprint, time_left)) {
        if (maxGeode(newState.robot_counts[3], time_left) + newState.balances[3] <= newState.maxGeode)
            continue;
        yield* simulator(blueprint, time_left - newState.delta, newState);
    }

    return;

}


const debug = false;

console.log("Simulating blueprints...")


const simulation = (totalTime: number, blueprintsSet: robot[][]): number[] => {
    const totalGeodes: number[] = [];

    blueprintsSet.forEach((blueprint, i) => {


        console.log("Blueprint ", i + 1)

        // you start with 1 ore robot
        const state0: state = { balances: [0, 0, 0, 0], robot_counts: [1, 0, 0, 0], delta: 1, maxGeode: 0 }
        const sim = simulator(blueprint, totalTime, state0);
        let sol = sim.next();
        let iter = 0;
        let maxGeode = 0;

<<<<<<< HEAD
    allBots[0] = 1; // you start with 1 ore robot
    let state0: state = { balances: new Array(4).fill(0), robots: allBots, maxGeode: 0 }
    let sim = simulator(blueprint, 0, 24, state0);
    let sol = sim.next();
    let ceiling = 0;
    let maxGeode = 0;
=======
        while (!sol.done) {
>>>>>>> 0d6a82fa8aeafa9a8813e38ff5b85473038b4727

            if (sol.value.balances[3] > maxGeode) {
                console.log(">>>>> Sol", sol.value.balances, sol.value.robots);
                maxGeode = sol.value.balances[3];
            }
            iter++;
            sol = sim.next();
        }

        console.log(`\t${sol.done ? "[v]" : "[x]"} Max geodes for blueprint ${i + 1} = ${maxGeode} @ iter. ${iter}`);
        totalGeodes.push(maxGeode);
    });
    return totalGeodes;
};

//Part 1 - total quality
const maxGeodesPerBlueprint = simulation(24, blueprints);
const qualityLevels = maxGeodesPerBlueprint.map((maxGeode, i) => (i + 1) * maxGeode);

const qualityTotal = qualityLevels.reduce((a, b) => a + b, 0);
console.log("Part 1 - Sum of quality leves", qualityTotal);
assert(qualityTotal == 851);



//Part 2: total of geodes of the first 3 blueprints, in 32 minutes
/*
const maxGeodesPerBlueprintPart2 = simulation(32, blueprints.slice(0, 3));
const part2Total = maxGeodesPerBlueprintPart2.reduce((a, b) => a * b, 1);
console.log("Part 2 - Product of geodes (blueprints 1 to 3)", part2Total);
//assert(qualityTotal == 851);
*/