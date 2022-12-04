// Read the file and print its contents.
const fs = require('fs');
let input = "day4-input.txt"


const data = fs.readFileSync(input, 'utf8').split("\n");

let ranges = data.map(e => e.split(/[-,]+/))  //split at - and ,

ranges = ranges.map(r => ({ ...r })) //destructuring to 4 keys 0,1,2,3
ranges = ranges.map(r => ({ e1_from: r['0'] * 1, e1_to: r['1'] * 1, e2_from: r['2'] * 1, e2_to: r['3'] * 1 }))

const rangeContains = ({ e1_from, e1_to, e2_from, e2_to }) => {
    return ((e2_to >= e1_to) && (e2_from <= e1_from)) || //e1 inside e2
        ((e2_to <= e1_to) && (e2_from >= e1_from));
}

const rangeOverlaps = ({ e1_from, e1_to, e2_from, e2_to }) => {
    return rangeContains( {e1_from, e1_to, e2_from, e2_to }) ||
        (e2_to >= e1_from && e2_to <= e1_to) ||
        (e2_from <= e1_to && e2_from >= e1_from);
}

//another solution, simpler
const rangeOverlaps2 = ({ e1_from, e1_to, e2_from, e2_to }) => {
    const dont_overlap = (e2_from > e1_to) || (e1_from > e2_to );
    return !dont_overlap;
}
ranges = ranges.map(a => ({...a, rangeContains:rangeContains(a)}))

//part 1 - 444
console.log("Solution part 1", ranges.filter(a => a.rangeContains).length)

ranges = ranges.map(a => ({...a, overlaps:rangeOverlaps(a), overlaps2:rangeOverlaps2(a)}))

//part 2 - 808
console.log("Solution part 2", ranges.filter(a => rangeOverlaps(a)).length)