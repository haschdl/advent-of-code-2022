import * as fs from 'fs'
let input = "input/day13-input.txt"

const rawData: string[] = fs.readFileSync(input, 'utf8').split("\n");

const d = rawData.map(i => { if (i) return JSON.parse(i); else return [];});
const debug = true;
const log = (message, args?: any[]) => { if (debug) if (args) console.debug(message, args); else console.debug(message) };

type order = -1 | 0 | 1
const isOrdered = (left: number | number[], right: number | number[], dep: number): order => {
    const t = " ".repeat(dep * 2)
    log(`${t}- Compare ${JSON.stringify(left)} vs ${JSON.stringify(right)}`);
    if (typeof left === "number" && typeof right === "number") {
        if (left < right)
            log(`${t}  - Left side is smaller, so inputs are in the right order`);
        else if (left > right)
            log(`${t}  - Right side is smaller, so inputs are not in the right order`);

        return Math.sign(right - left) as order; //if d2 is larger: returns +1 
    }
    else if (Array.isArray(left) && typeof right === "number") {
        log(`${t}- Mixed types; convert right to [] and retry comparison`);
        return isOrdered(left, [right], dep + 1)
    }
    else if (Array.isArray(right) && typeof left === "number") {
        log(`${t}- Mixed types; convert LEFT to [] and retry comparison`);
        return isOrdered([left], right, dep + 1)
    }
    else if (Array.isArray(right) && Array.isArray(left)) {
        // arrays
        const maxLen = Math.max(left.length, right.length)
        for (let i = 0; i < maxLen; i++) {
            if (left[i] === undefined) {
                log(`${t}  - Left side ran out of items, so inputs are in the right order`)
                return 1;
            }
            if (right[i] === undefined) {
                log(`${t}  - Right side ran out of items, so inputs are not in the right order`);
                return -1;//right side run out of items

            }
            const isOrd = isOrdered(left[i], right[i], dep + 1);
            if (isOrd == 0) continue;//inconclusive, continue; 
            return isOrd;
        }
        return 0;
    }
    return -1;
}

let sum = 0;
let ixord: number[] = []
for (let i = 0; i < d.length / 3; i += 1) {
    const ix = i * 3;
    const e1 = d[ix], e2 = d[ix + 1];
    console.log(`\n== Pair ${i + 1} ==`)
    const o = isOrdered(e1, e2, 0) == 1;
    sum += o ? (i + 1) : 0;
    if (o) ixord.push(i + 1)
    //console.log(`Pair ${i + 1} ${o ? "IS" : "is NOT"} ordered`)

}
//5949:too high
//5285: too low
//5583
//console.log("Ordered", ixord)
//5393
console.log("Solution part 1", sum)

const dividers:any[] =[[[2]], [[6]]];
let sorted = d.filter((_,ix) => ix%3!=2);
sorted.push(...dividers);
sorted.sort((a,b) => -isOrdered(a,b,0))
const solutionPart2 = dividers.reduce((sol,s) => sol * (1 + sorted.findIndex(v => JSON.stringify(s)==JSON.stringify(v))),1)
console.log("Solution part 2", solutionPart2) //26712