import * as fs from 'fs'
import { Point as p,drawGridOffSet } from './utils'
let input = "input/day14-input-samp.txt"

const rawData: string[] = fs.readFileSync(input, 'utf8').split("\n");

type path = p[]
let d = rawData.map(line => line.split(" -> "));
let paths:path[] = d.map((pairs) => pairs.map(p => ({x:Number(p.split(',')[0]), y:Number(p.split(',')[1])})));
console.log(paths)
drawGridOffSet(paths)
const start:p = {x:500,y:0}

