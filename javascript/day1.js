// Read the file and print its contents.
const fs = require('fs');
let input = "input/day1-input.txt"

const dataAsString = fs.readFileSync(input, 'utf8');
let data = dataAsString.split("\n\n").map(e=>e.split("\n"))
let sums = data.map(elf => elf.reduce((a,b)=>a*1+b*1,0))
sums.sort((a,b) => b-a)


//part 1 - Largest sum of calories (70296)
console.log("Solution to part 1", sums[0])

//part 2 - Largest sum of top 3 calories 
const top3 = sums.slice(0,3).reduce((a,b)=>a+b,0)
console.log("Solution to part 1", top3)

