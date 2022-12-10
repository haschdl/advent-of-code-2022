import * as fs from 'fs';
import { PerformanceObserver, performance } from 'node:perf_hooks';

let input = "input/day6-input.txt"

const rawData: string[] = fs.readFileSync(input, 'utf8').split("");

//SoP = Start-of-packat
//SoM = Start-of-message

const isSoPMarker = (input: string[]): boolean => { const [c1, c2, c3, c4] = input; return (c1 !== c2 && c1 !== c3 && c1 !== c4 && c2 !== c3 && c2 !== c4 && c3 !== c4) };

//
const markerPosition = rawData.findIndex((_val, ix, arr) => isSoPMarker([...arr.slice(ix, ix + 4)]))
console.log("Solution (part 1)", markerPosition + 4)


//part 2, SoM consists of 14 distinct characters...
const isArrayDistinct = (arr: string[]) => {
    const isNotDistinct = arr.some((val, ix, arr) => arr.slice(ix + 1).some(val2 => val2 == val))
    return !isNotDistinct;
}

//another implementation. Seems same as above
const isArrayDistinctIndex = (arr: string[]) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr.indexOf(arr[i]) !== arr.lastIndexOf(arr[i])) {
            return false;
        }
    }
    return true;
}


//This is second implementation using Set() => it does not seem faster!
const isArrayDistinctSet = (arr: string[]) => {
    const seen = new Set();
    for (let i = 0, n = arr.length; i < n; ++i) {
        const item = arr[i];
        if (seen.has(item)) {
            return false;
        }
        seen.add(item);
    }
    return true;
}



const perfObserver = new PerformanceObserver((items) => {
    items.getEntries().forEach(entry => console.log(entry.name, entry.duration));
    performance.clearMarks();
});
perfObserver.observe({ type: 'measure' });

performance.measure('Executing with nested some() algorith');
performance.mark('A');
const SoMPosition = rawData.findIndex((_val, ix, arr) => isArrayDistinct([...arr.slice(ix, ix + 14)]))
console.log("Solution part 2", SoMPosition + 14)
performance.mark('B');
performance.measure('', 'A', 'B');


performance.measure('Executing with Set() algorith');
performance.mark('C');
const SoMPosition2 = rawData.findIndex((_val, ix, arr) => isArrayDistinctSet([...arr.slice(ix, ix + 14)]))
console.log("Solution part 2 (Set-based algorithm)", SoMPosition2 + 14)
performance.mark('D');
performance.measure('', 'C', 'D');
