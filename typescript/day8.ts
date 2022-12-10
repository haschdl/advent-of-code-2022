// Read the file and print its contents.
import * as fs from 'fs';
import { listenerCount } from 'process';
import Tree from 'ts-tree-structure';
import { Node } from 'ts-tree-structure';
const tree = new Tree();

let input = "input/day8-input.txt"

const rawData: string[][] = fs.readFileSync(input, 'utf8').split("\n").map(line => line.split(""));

const transpose = (array: any[][]) => array[0].map((_, colIndex) => array.map(row => row[colIndex]));

let original = rawData.map(line => line.map(row => Number(row)));
let transposed: number[][] = transpose(original);

const visibleInCol = (i: number, line: number[]): boolean => (line[i] > Math.max(...line.slice(0, i)) || line[i] > Math.max(...line.slice(i + 1)))

const visibleLeftRight = original.map((row) => row.map((_val, ix, vals) => visibleInCol(ix, vals)));
const visibleUpDown = transpose(transposed.map((row) => row.map((_val, ix, vals) => visibleInCol(ix, vals))));

// || of all items
const visible = visibleLeftRight.map((r, i) => r.map((v, j) => v || visibleUpDown[i][j]));


console.log("Solution part 1", visible.map((row) => row.filter(col => col).length).reduce((a, b) => a + b)); //1497: too low

//Part 2
type args = { val: number, i: number, row: number[] }
const scoreLeft = (a: args): number => {
    const s = a.row.slice(0, a.i);
    const l = s.length;  // 2 5 5 1 2
    const p = s.findLastIndex(t => t >= a.val); // 2 3 0 3 7 3
    return (p < 0) ? l : l - p
};

const scoreRight = (a: args): number => {
    const s = a.row.slice(a.i + 1);
    const l = s.length;
    const p = s.findIndex(t => t >= a.val); //2 5 112
    return (p==-1) ? l : p+1;
};

const scenicScore = (a: args): number => scoreLeft(a)*scoreRight(a);


const scoresLeftRight = original.map((row, j) => row.map((val, i) => scenicScore({ val, i, row })));
const scoresUpDown = transpose(transposed.map((row, j) => row.map((val, i) => scenicScore({ val, i, row }))));
const scores = scoresLeftRight.map((r, i) => r.map((v, j) => v * scoresUpDown[i][j]));

//527340
console.log("Solution part 2", Math.max(...scores.flatMap(r => r)))
