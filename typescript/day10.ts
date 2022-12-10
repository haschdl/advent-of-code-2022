import * as fs from 'fs';
import { printGrid } from './utils';
let input = "input/day10-input.txt"

type instruction = { ins: string, v: number, s?: number }
const rawData: string[][] = fs.readFileSync(input, 'utf8').split("\n").map(l => l.split(" "));


let inst: instruction[] = rawData.map((v, _ix) => ({ ins: v[0], v: Number(v[1] || 0) }))
type cycle = instruction & { cycle?: number, strength?: number }
let cycles: cycle[] = [];
inst.forEach(inst => { if (inst.ins != "addx") cycles.push(inst); else cycles.push(...[({ ins: "addz", v: 0 }), inst]); });


cycles.forEach((v, ix) => {
    v.cycle = ix + 1;
    //1 + because of the starting value
    v.s = 1 + cycles.slice(0, ix).reduce((a, b, ix) => a + b.v, 0);
    v.strength = (v.cycle * v.s); //cycle number * sum
});

//based on rule: 20, 60, 100, 140, 180, 220
const answer = cycles.filter((v, ix) => ix == 19 || ((ix - 20) % 40) == 39)

console.log(answer.reduce((a, b, ix) => a + (ix < 221 ? (b.strength || 0) : 0), 0))

// Part 2
// Here I got that "cycles" was a bad name, so I'm renaming for clarity
const registerValues = cycles;
type sprite = string[]

let screen: string[][] = new Array(6).fill(0).map(i => new Array(40).fill("_"));

const drawCycle = () => {
    for (let n = 0; n < registerValues.length; n++) {
        const cycle = n + 1;
        const x = n % 40;
        const y = Math.floor(n / 40) % 6;
        const spritePos = registerValues[n].s || -1;
        if (Math.abs(spritePos - x) < 2) //sprite is positioned such that one of its three pixels is the pixel currently being drawn, the screen produces a lit pixel (#); otherwise, the screen leaves the pixel dark (.).
            screen[y][x] = "#";
        else
            screen[y][x] = ".";
        //printGrid(screen, '')
        //console.log(`Drawing pixel at x=${x}`); 
        //console.log(`Sprite position at cycle ${cycle}=${spritePos}:\n${".".repeat(spritePos-1) + "###" + ".".repeat(38-spritePos)}`);
        
    }
}
drawCycle();
printGrid(screen, '')
console.log("Solution part 2","");
