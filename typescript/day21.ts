import * as fs from 'fs'
import { removeAllListeners } from 'process';

import { Range } from '../lib/Range'
let input = "input/day21-input.txt";
//let input = "input/day15-input-samp.txt" ;let y = 10;

const rawData: string[] = fs.readFileSync(input, 'utf8').split("\n");




type nodeString = { name: string, value?: number; left?: string | undefined, right?: string | undefined, op?: string | undefined }
type node = { name: string, value: number; left?: node, right?: node, op?: string, flag?: boolean, p?: node }
const nodeNames = new Set();
let nodeAsStrings: nodeString[] = []
const regexpSize = /([a-z]{4}): ([a-z]{4}|(?:\d*\.?\d*))\s?(.)?\s?([a-z]{4})?/gm
rawData.forEach(l => {
    const ms = [...l.matchAll(regexpSize)];
    nodeNames.add(ms[0][1]);

    if (ms[0][4] != undefined) {
        let newNode: nodeString = { name: ms[0][1], value: undefined, left: ms[0][2], op: ms[0][3], right: ms[0][4] };
        nodeAsStrings.push(newNode);
    }
    else {
        const newNode2: nodeString = { name: ms[0][1], value: Number(ms[0][2]) };
        nodeAsStrings.push(newNode2);

    }
});
let nodes: node[] = nodeAsStrings.map(ns => ({ name: ns.name, value: (ns.value || 0) }));
nodes.forEach((n, i) => {
    if (nodeAsStrings[i].left)
        n.left = nodes.find(nd => nd.name === nodeAsStrings[i].left);
    if (nodeAsStrings[i].right)
        n.right = nodes.find(nd => nd.name === nodeAsStrings[i].right);
    if (nodeAsStrings[i].op)
        n.op = nodeAsStrings[i].op
});
let op = (a: number, b: number, opStr?: string) => {
    switch (opStr) {
        case "+":
            return a + b;
        case "*":
            return a * b;
        case "-":
            return a - b;
        case "/":
            return a / b;
        default:
            throw "Not expected: op" + opStr
    }
};
let opReverse = (dir:"LEFT"|"RIGHT"="LEFT", result: number, b: number | undefined, opStr?: string) => {
    if (b === undefined)
        return result;
    switch (opStr) {
        case "+":
            return result - b;
        case "*": 
            return result / b;
        case "-":
            return (dir=="LEFT") ? (result + b) : (b - result);
        case "/":
            return (dir=="LEFT") ? result * b : b / result;
        default:
            throw "Not expected: op" + opStr
    }
};
let traverse = (root?: node): number => {
    if (root == undefined)
        return 0;
    if (!root.left && !root.right) {
        return root.value;
    }
    let opFunc = (a: number, b: number) => Number;

    if (root.left) root.left.p = root;
    if (root.right) root.right.p = root;
    return root.value += op(traverse(root.left), traverse(root.right), root.op);

}

//part 1: total for root
let rootIx = nodes.findIndex(n => n.name == "root");
console.log(traverse(nodes[rootIx]))

//part 2:reverse
let root = nodes.find(n => n.name == "root");
let humn = nodes.find(n => n.name == "humn");
console.log(root)
console.log(humn)

type nodeFunction = (n: node) => void;
let findNode = (start: node, find: node, action: nodeFunction): boolean => {

    if (start.name == find.name) {
        action(start);
        return true;
    }
    if (start.left && findNode(start.left, find, action)) {
        action(start);
        return true;
    }
    if (start.right && findNode(start.right, find, action)) {
        action(start);
        return true;
    }
    return false;
}

let traverseReverse = (start: node, find: node) => {
    if (start.name == find.name) {

        //find.value = start.value;
        return find;
    }
    if (start.left?.flag && start.right?.flag)
        throw "Wrong flags"
    /*
    if(root.left?.name==find.name) {
        find.value= !root.right ? root.value : opReverse(root.value,root.right?.value,root.op);
        return;
    }
    if(root.right?.name==find.name) {
        find.value= !root.right ? root.value : opReverse(root.value,root.right?.value,root.op);
        
        return;
    }
    */
    if (start.right?.flag===true) {
        start.right.value = opReverse("RIGHT", start.value, start.left?.value, start.op);
        return traverseReverse(start.right, find);
    }
    if (start.left?.flag===true) {
        start.left.value = opReverse("LEFT", start.value, start.right?.value, start.op);
        return traverseReverse(start.left, find);
    }
   
}

if (root && humn) {
    findNode(root, humn, node => node.flag = true);

    //debugging
    if (root.left?.flag===true && root.right?.flag===true)
        throw "Wrong flags"
    if (root.left?.flag && root.right) {
        root.left.value = root.right.value;
        traverseReverse(root.left, humn);
    }
    else if (root.right?.flag===true && root.left) {
        root.right.value = root.left.value;
        traverseReverse(root.right, humn);
    }

    console.log("Part 2 solution", humn.value);
}