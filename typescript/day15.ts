import { assert, debug } from 'console';
import * as fs from 'fs'
import { Point as p, Point, splitChunks, drawArrayOffSet, printGrid } from './utils'
import { Range } from '../lib/Range'
let input = "input/day15-input.txt" ;let y = 2000000;
//let input = "input/day15-input-samp.txt" ;let y = 10;

const rawData: string[] = fs.readFileSync(input, 'utf8').split("\n");

type sensorBeacon = { s: p, b: p }
type area = { s: p, b: p, r: number }
type rangeX = { from: number, to: number }
const areaContainsP = (a: area, p: p) => p.distM(a.s) <= a.r && !p.equals(a.b);
const areaContainsY = (a: area, y: number) => Math.abs(y - a.s.y) <= a.r;

const areaRangeAtY = (a: area, y: number) => {
    if (!areaContainsY(a, y))
        return undefined;
    let dx = a.r - Math.abs(a.s.y - y);
    if (a.b.y !== y) {
        return { from: a.s.x - dx, to: a.s.x + dx } as rangeX;
    }
    if (a.b.x < a.s.x) //beacon is to the left
        return { from: a.s.x - dx+1, to: a.s.x + dx } as rangeX;
    return { from: a.s.x - dx, to: a.s.x + dx -1 } as rangeX;
};
const rangeXOverlap = (r1: rangeX, r2: rangeX) => Range.overlap(Math.min(r1.from,r1.to),Math.max(r1.from,r1.to),Math.min(r2.from,r2.to),Math.max(r2.from,r2.to));
const rangeXMerge = (r1: rangeX, r2: rangeX): rangeX[] => {
    if (r1 === undefined)
        return [r2];
    return rangeXOverlap(r1, r2) ? [{ from: Math.min(r1.from, r2.from), to: Math.max(r1.to, r2.to) }] : [r1, r2];
}


const regexpSize = /x=(-?[0-9]+), y=(-?[0-9]+)/mg;
const pairs: sensorBeacon[] = rawData.map(l => {
    let ms = [...l.matchAll(regexpSize)];
    return { s: new p(Number(ms[0][1]), Number(ms[0][2]), "S"), b: new p(Number(ms[1][1]), Number(ms[1][2]), "B") }
});

const areas: area[] = pairs.map(v => ({ s: v.s, b: v.b, r: v.s.distM(v.b) }))

if (y == 10)
    console.log(drawArrayOffSet(areas.flatMap(a => [a.s, a.b])))

const finalRanges = (yCheck: number) => {
    let areasToCheck = areas.filter(a => areaContainsY(a, yCheck));
    let rangesToChck = areasToCheck.map(a => areaRangeAtY(a, yCheck)).filter(e => e !== undefined);

    rangesToChck.sort((a, b) => a.from - b.from);

    let finalRanges: rangeX[] = [];
    rangesToChck.forEach(r => 
        finalRanges = [...finalRanges.slice(0, -1), ...rangeXMerge(finalRanges.slice(-1)[0], r)]);

    if (finalRanges.length == 2)
        finalRanges = rangeXMerge(finalRanges[0], finalRanges[1]);
  

    if (y == 10) {
        let borders = areas.flatMap(a => a.s.rectFull(a.r).map(p => p.setC("#")));
        //let a = areas[6];
        // let borders = a.s.rect(a.r).map(p => p.setC("#"));
        console.log(drawArrayOffSet([...borders, ...areas.flatMap(a => [a.s, a.b])]));
        //console.log(`Range at y of sensor at ${a.s}(r=${a.r})`, areaRangeAtY(a, y));
    }
    return finalRanges;
}








let len = finalRanges(y).reduce((res, r) => res + r.to - r.from + 1, 0);

//finally discount # of beacons at y; beacons positions are not unique in input!
const beaconsAtY = new Set(pairs.filter((p) => p.b.y == y).map(p => p.b.x)).size;
const sensorsAtY = new Set(pairs.filter((p) => p.s.y == y).map(p => p.s.x)).size;

//1345000 too low
//5200644 too low
//5200645 too low
//5838452 wrong
//5838453
console.log("Sol part 1", len - beaconsAtY)


//Part 2
//beacon is  x and y coordinates each no lower than 0 and no larger than 4000000.
let b = new Point(0,0);
for (let yt = 0; yt < 4e6; yt++) {
    let rangesY = finalRanges(yt);
    const beaconsAtY = new Set(pairs.filter((p) => p.b.y == yt).map(p => p.b.x)).size;
    if (rangesY.length > beaconsAtY + 1) {
        console.log("solutio at y = ", yt);
        b.y = yt;

        break;
    }
}

//x is the empty spot between the remainng rangesY above: 3103499
//solution then: calculated on the calculator :     12413999391794

console.log("Solution part 2", b.x * 4000000 + b.y)