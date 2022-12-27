import { assert } from 'console';
import * as fs from 'fs'
import { Point as p, drawArrayOffSet } from './utils'
import { Range } from '../lib/Range'
import Graph from '../lib/Graph';
import { WeightedGraph } from '../lib/WeightedGraph';
import { Piece } from './piece';
import { bitsToString, isBitSet } from '../lib/Binary';
import { threadId } from 'worker_threads';
let input = "input/day22-input.txt";

const raw: string[] = fs.readFileSync(input, 'utf8').split("\n");


const path = raw.slice(-1)[0];
let mapStrings = raw.slice(0, -2);
//const maxLength = mapStrings.reduce((a, b) => Math.max(a, b.length), -1);

function* pathGen(path: string) {
    let i = 0;
    let start = 0;
    let next: "number" | "direction" = "number";
    let nextIx = 1;
    while (nextIx > 0) {

        if (next == "number") {
            nextIx = path.slice(start).search(/[A-Z]/g);
            next = "direction";
        }
        else {
            nextIx = path.slice(start).search(/\d+/g);
            next = "number";
        }
        if (nextIx == -1)
            yield path.substring(start);
        else yield path.substring(start, start + nextIx);

        start += nextIx;
    }
}

type dir = "R" | "L"
type cell = "." | "#"
//Facing is 0 for right (>), 1 for down (v), 2 for left (<), and 3 for up (^)
const facing = [">", "v", "<", "^"] as const;

const OPEN = ".";
const WALL = "#";

//part 2, 3D
type face = "A" | "B" | "C" | "D" | "E" | "F";
type pos = { x: number, y: number }
type updater = (pos: pos) => void;

class Map {
    lines: string[];
    visited: string[][];
    _pos: pos;
    facing: number;
    MAX: number;

    constructor(lines: string[]) {
        this.lines = lines.slice();
        this.visited = lines.slice().map(l => l.split(""));
        this._pos = { x: this.lines[0].indexOf("."), y: 0 };
        this.MAX = this.lines.length - 1;
        this.facing = 0;//Facing is 0 for right (>), 1 for down (v), 2 for left (<), and 3 for up (^)
        this.visitedSet = this.facing;

    }

    //string.split("").[x] is not the same as string.at(n) because split+index returns undefined 
    //for negative!
    private valid = (val: string) => val == "." || val == "#";
    private rowStartIx = () => this.row().split("").findIndex(e => this.valid(e));
    private rowStart = () => this.row().split("")[this.rowStartIx()];

    private rowEndIx = () => this.row().length-1;//split("").findLastIndex(e => this.valid(e));
    private rowEnd = () => this.row().split("")[-1];

    private colStartIx = (): number => this.lines.findIndex(e => this.valid(e.split("")[this.x]));
    private colStart = (): string => this.lines[this.colStartIx()].split("")[this.x];

    private colEndIx = (): number => this.lines.findLastIndex(e => this.valid(e.split("")[this.x]));
    private colEnd = (): string => this.lines[this.colEndIx()].split("")[this.x];

    /**
     * The row at this.pos.y
     * @returns 
     */
    private row = () => this.lines[this._pos.y];


    private at = (y: number, x: number) => {
        if (!this.lines[y])
            return undefined;
        //using split plus index as "string.at" does not return undefined
        return this.lines[y].split("")[x];
    }

    get x() {
        return this._pos.x;
    }
    get y() {
        return this._pos.y;
    }

    set visitedSet(facingIx: number) {
        this.visited[this.y][this.x] = facing[facingIx];
    }


    updatePosGen = (facingCurr: number): boolean => {

        const yInc = [0, 1, 0, -1][facingCurr];
        const xInc = [1, 0, -1, 0][facingCurr];

        const next = this.at(this.y + yInc, this.x + xInc);
        if (next === WALL)
            return false;

        if (next === OPEN) {
            this._pos.x += xInc; this._pos.y += yInc;
            return true;
        }

        //if (next === undefined || next === EMPT) {
        switch (facingCurr) {
            case 0: //RIGHT >
                if (this.rowStart() === OPEN)
                    this._pos.x = this.rowStartIx(); //loop to beggining                    
                break;
            case 1: //DOWN v
                if (this.colStart() === OPEN) {
                    this._pos.y = this.colStartIx(); //loop
                }
                break;
            case 2: //LEFT <
                if (this.rowEnd() === OPEN) // facing: [<]
                    this._pos.x = this.rowEndIx(); //loop to end
                break;
            case 3: //UP ^
                if (this.colEnd() === OPEN)
                    this._pos.y = this.colEndIx(); //loop
                break;
            default:
                throw "Oops";
        }
        return true;
    };

    updatePos2D = () => {
        this.visitedSet = this.facing;

        return this.updatePosGen(this.facing);

    }


    next = (): { f: number } => {
        const x = this.x, y = this.y, f = this.cubeFace(), d = this.facing;
        if (f == "A" && x == 99 && d == 0) { //right
            //normal
        }
        if (f == "A" && x == 49 && d == 2) { // left
            //next face:E, invert Y

        }
        if (f == "A" && y == 0 && d == 3) { //up
            //next face : F, dir 0


        }
        return { f: 0 }

    }

    cubeFace = (): face => {
        if (this.y < 50)
            if (this.x < 100)
                return "A";
            else
                return "B";
        else if (this.y < 100)
            return "C"
        else if (this.y < 200)
            if (this.x < 50)
                return "E";
            else
                return "D";
        return "F";

    }
    updatePos3D = () => {
        //determine face
        const f = this.cubeFace();
        switch (f) {
            case "A":

                break;
            case "B":
                break;

        }

    }

    move(move: string): void {
        if (isNaN(Number(move))) {
            let i = this.facing;
            if (move == "L") {
                if (i == 0)
                    i = 3;
                else i--;
            }
            if (move == "R")
                i = (++i % 4);

            this.facing = i;
            this.visitedSet = this.facing;

            return;
        }
        else {
            const steps: number = Number(move);


            Range.from(0, steps).every(i => this.updatePos2D());
        }
    }

    get pos() {
        return this._pos;
    }
    get state() {
        return `facing: [${facing[this.facing]}] position [${this.x},${this.y}]`;
    }
}


//console.log("map", mapStrings)



//const map: string[][] = new Array(mapStrings.length).fill(0).map(e => []);
//mapStrings.forEach((l, ix) => { const p0 = l.search((/\.|\#/g)); map[ix].length = l.length; map[ix].splice(p0, 0, ...l.slice(p0)) })

//mapStrings = mapStrings.map(e => e.length < maxLength ? e + (" ").repeat(maxLength - e.length) : e);
let map = new Map(mapStrings);


//console.log("Start", map.pos)
for (let p of pathGen(path)) {

    map.move(p);

    //console.log(`State after move ${p}\t`, map.state);
    //console.log(map.visited.forEach(l => console.log(l.join(""))));

}

console.log("after traversing path"); map.visited.forEach(l => console.log(l.join("")));

console.log(`Final position [${map.y + 1},${map.x + 1}] facing = ${facing[map.facing]}`);
const passwordPart1 = 1000 * (map.y + 1) + 4 * (map.x + 1) + map.facing;
console.log("Password", passwordPart1)

if (input == "input/day22-input.txt") assert(passwordPart1 === 190066)

