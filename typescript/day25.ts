import * as fs from 'fs'
import { Point as p, drawArrayOffSet } from './utils'
import { Range } from '../lib/Range'
import { assert } from 'console';
const input = "input/day25-input.txt";

const raw: string[] = fs.readFileSync(input, 'utf8').split("\n");

const c = ["=", "-", 0, 1, 2];
const n = [-2, -1, 0, 1, 2];
const rem = [3, 4, 0, 1, 2];
const C = new Map<string, number>();
const N = new Map<number, string>();
const R = new Map<number, string>();
const R_to_N = new Map<number, number>();
c.forEach((ci, i) => C.set(String(ci), n[i]));
n.forEach((ni, i) => N.set(ni, String(c[i])));
rem.forEach((ri, i) => R.set(ri, String(c[i])));
rem.forEach((ri, i) => R_to_N.set(ri, n[i]));


const toDecimal = (s: string): number => {
    return s.split("").reverse().reduce((t, c, i) => t += Math.pow(5, i) * (C.get(c) || 0), 0);
}

const snafu = (n: number): string => {
    let i = 1, done = false;
    let s = "";
    while (!done && i <= 1000) {
        const div = 5;
        const q = Math.floor(n / div);
        const r = (n % div);        //remainder         = 0,1,2, 3, 4
        const rr = R_to_N.get(r);   //remainder mapped: = 0,1,2,-2,-1
        if (rr == undefined)
            throw "Ooops";
        if (rr < 0)
            n = q + 1;
        else
            n = q;

        s = `${N.get(rr)}${s}`;

        if (q == 0 && rr >= 0)
            break;
        i++;
    }
    if (i == 1000)
        throw "Ooops";

    return s;
}



console.log("SNAFU\tDecimal");
//["1", "2", "1=", "1-", "10", "11", "12", "2=", "2-", "20", "1=0", "1=11-2"].forEach(s => console.log(`${s}\t${toDecimal(s)}`))


console.log("Decimal\tSNAFU\tDecimal");
Range.from(0, 100).forEach(d => console.log(`${d}\t${snafu(d)}\t${toDecimal(snafu(d))}`));


//Part 1
const snafus = raw.map(s => toDecimal(s)).reduce((t,n)=> t+=n,0);
console.log("sum of numbers",snafus);
console.log("Part 1 - total in snafu", snafu(snafus))