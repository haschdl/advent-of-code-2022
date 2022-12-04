import * as fs from 'fs';
let input = "input/day1-input.txt"

const dataAsString: string = fs.readFileSync(input, 'utf8');
let data: string[][] = dataAsString.split("\n\n").map(e=>e.split("\n"))
let sums: number[] = data.map(elf => elf.reduce((a,b)=>Number(a)+Number(b),0))


//part 1 - Largest sum of calories (70296)
sums.sort((a,b) => b-a)
console.log("Solution part 1", sums[0])

//another way (does not need the sort)
console.log("Solution part 1", Math.max(...sums))

//part 2 - Largest sum of top 3 calories 
const top3 = sums.slice(0,3).reduce((a,b)=>a+b,0)
console.log("Solution part 2", top3)

