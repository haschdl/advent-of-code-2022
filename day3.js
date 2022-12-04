// Read the file and print its contents.
const fs = require('fs');
let input = "day3-input.txt"


const data = fs.readFileSync(input, 'utf8').split("\n");

//splits into a dict with keys cpt1 and cpt2 , each having half of the chars
let dataPart1 = data.map(e => ({cpt1:e.slice(0,h=e.length / 2).split(''),cpt2:e.slice(h).split('')}));

//this converts X,Y,Z to A,B,C
 dataPart1 = dataPart1.map(({cpt1, cpt2}) => cpt2.find(el2 => cpt1.some(el1=> el1==el2)))

const prio = (item) => {
    if(item.match(/[a-z]/g)) return item.charCodeAt(0)-96;
    if(item.match(/[A-Z]/g)) return item.charCodeAt(0)-38;
}

dataPart1 = dataPart1.map(e => ({...e, prio:prio(e)}))

//part 1 - 8153
console.log("Solution part 1" ,dataPart1.reduce((a,b)=> a + b.prio,0))


//part 2

let dataPart2 = Array(data.length/3).fill(0).map((el,ix) => el = [ data[ix*3],data[ix*3+1],data[ix*3+2] ])

const findCommon = (arr1,arr2,arr3) => {
  
    return arr1.find(el1 => arr2.some(el2=> el2==el1 && arr3.some(el3 => el3 == el2)))
};

dataPart2.forEach(elf => {elf[0]=elf[0].split(''); elf[1]= elf[1].split(''); elf[2]= elf[2].split('');});

const cm= findCommon(...dataPart2[0])

dataPart2 = dataPart2.map(elf => ({elves:elf, common: findCommon(...elf)}))

console.log("Solution part 2", dataPart2.reduce((a,b)=> a + prio(b.common),0))