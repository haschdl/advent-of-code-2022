import * as fs from 'fs';
let input = "input/day11-input.txt"

const rawData: string[] = fs.readFileSync(input, 'utf8').split("\n");
const debug = false;

const m = (rawData.length + 1) / 7; //monkeys
let worries = new Array(m).fill(0).map(_ => new Array())
new Int16Array(m).forEach((_, i) => worries[i].push(...rawData[1 + i * 7].split(": ")[1].split(", ").map(s => Number(s))))

const move = (i, monkey) => { worries[monkey].push(i) }


//in part 1, worries get divided by 3 at each round
//i have hardcoded the movement operations since there are only a few
let movesSample = (div:number, h:number): any[] =>  [
    i => { i *= 19; i = Math.floor(i / div); i % 23 == 0 ? move(i%h, 2) : move(i%h, 3) },
    i => { i += 6; i = Math.floor(i / div); i % 19 == 0 ? move(i%h, 2) : move(i%h, 0) },
    i => { i *= i; i = Math.floor(i / div); i % 13 == 0 ? move(i%h, 1) : move(i%h, 3) },
    i => { i += 3; i = Math.floor(i / div); i % 17 == 0 ? move(i%h, 0) : move(i%h, 1) },
]
        
let movesFull = (div:number, h:number): any[] =>  [
    i => { i *= 17; i = Math.floor(i / div); i % 13 == 0 ? move(i%h, 6) : move(i%h, 7) },
    i => { i += 8; i = Math.floor(i / div); i % 7 == 0 ? move(i%h, 0) : move(i%h, 7) },
    i => { i += 6; i = Math.floor(i / div); i % 19 == 0 ? move(i%h, 5) : move(i%h, 3) },
    i => { i *= 19; i = Math.floor(i / div); i % 2 == 0 ? move(i%h, 4) : move(i%h, 1) },
    i => { i += 7; i = Math.floor(i / div); i % 5 == 0 ? move(i%h, 1) : move(i%h, 0) },
    i => { i *= i; i = Math.floor(i / div); i % 3 == 0 ? move(i%h, 3) : move(i%h, 4) },
    i => { i += 1; i = Math.floor(i / div); i % 11 == 0 ? move(i%h, 5) : move(i%h, 2) },
    i => { i += 2; i = Math.floor(i / div); i % 17 == 0 ? move(i%h, 6) : move(i%h, 2) },
]

worries.forEach((v, monkey) => console.log(`Monkey ${monkey} = ${v}`))
let countInpections = new Array(m).fill(0);
let moves = input.indexOf("samp")>0 ? movesSample : movesFull;
let h = input.indexOf("samp")>0 ? 13*17*19*23 : 2*3*5*7*11*13*17*19;

new Int16Array(20).forEach((_, round) => {
    worries.forEach((worriesPerMonkey, monkey) => {
        countInpections[monkey] += worriesPerMonkey.length;
        worriesPerMonkey.forEach(item => {
            moves(3,h)[monkey](item);
        });
        worries[monkey] = [];
    });

    if (debug) {
        console.log(`After round ${round + 1}, the monkeys are holding items with these worry levels:`)
        worries.forEach((v, monkey) => console.log(`Monkey ${monkey} = ${v}`))
        console.log(`After round ${round + 1}, the monkeys inpected: ${countInpections}`)

    }
});

//solution part 1 = top 2 by count of inspections, multiplied
console.log("Solution part 1", countInpections.sort((a, b) => b - a).slice(0, 2).reduce((a, b) => a * (b || 1)))

//for part 2
countInpections = new Array(m).fill(0);
worries = new Array(m).fill(0).map(_ => new Array());
new Int16Array(m).forEach((_, i) => worries[i].push(...rawData[1 + i * 7].split(": ")[1].split(", ").map(s => Number(s))))

new Int16Array(10000).forEach((_, round) => {
    worries.forEach((worriesPerMonkey, monkey) => { countInpections[monkey] += worriesPerMonkey.length; worriesPerMonkey.forEach(item => { moves(3,h)[monkey](item); }); worries[monkey] = [] });
   
    if(round <=10 || round == 19) {
        if (debug) {
            console.log(`After round ${round + 1}, the monkeys are holding items with these worry levels:`)
            worries.forEach((v, monkey) => console.log(`Monkey ${monkey} = ${v}`))
            console.log(`After round ${round + 1}, the monkeys inpected: ${countInpections}`)
    
        }
        
    }
        if ((round + 1) % 1000 == 0) {
        console.log(`After round ${round + 1}, the monkeys inpected: ${countInpections}`)
    }
});

//solution part 1 = top 2 by count of inspections, multiplied
console.log("Solution part 2", countInpections.sort((a, b) => b - a).slice(0, 2).reduce((a, b) => a * (b || 1)))
