// Read the file and print its contents.
import * as fs from 'fs';
import Tree from 'ts-tree-structure';
import { Node } from 'ts-tree-structure';
const tree = new Tree();

let input = "input/day7-input.txt"

const rawData: string[] = fs.readFileSync(input, 'utf8').split("\n");

type Parts = { p1: string, p2: string, p3: string }


const parse = (line: string): Parts => {
    const [p1, p2, p3] = line.split(" ");
    return { p1: p1, p2: p2, p3: p3 || "" }
}


let data = rawData.map(i => ({ s: i, command: parse(i) }))

type NodeType = { id: number, name: string, command: Parts, size: number }
let root = tree.parse({ id: 0, name: "/", command: data[0].command } as NodeType);
let currentNode = root;
data.slice(1).forEach((val, ix) => {
    const [p1, p2, p3] = [val.command.p1, val.command.p2, val.command.p3];
    if (p1 == "$" && p2 == "cd" && p3 == "..") {
        const dir = currentNode.parent;
        if (dir)
            currentNode = dir;
    }
    if (p1 == "$" && p2 == "cd") {
        const dir = currentNode.children.find(n => n.model.name == `dir ${p3}`);
        if (dir)
            currentNode = dir;
    }
    else if (p2 == "ls") {
    }
    else if (p1.match(/\d+/)) {
        const newNode = tree.parse({ id: ix, name: val.s, command: parse(val.s), size: Number(p1) });
        currentNode.addChild(newNode);
    }
    else { //it's a dir
        const newNode = tree.parse({ id: ix, name: val.s, command: parse(val.s), size: 0 });
        currentNode.addChild(newNode);
    }
});

const sumNodes = (node: Node<NodeType>, sum: number): number => {
    if (!node.hasChildren())
        return node.model.size;

    return node.children.reduce((a, b) => a + sumNodes(b, sum), 0);
}

root.walk((node) => {
    node.model.size = sumNodes(node, 0);
    return true;
});


// Part 1: the sum of sizes of all dirs with size smaller than 100k
let sumOfDirs = 0;
let dirSizes:number[] = [];
root.walk((node) => {if (node.model.command.p1 == "dir") dirSizes.push(node.model.size); return true});

sumOfDirs = dirSizes.reduce((a,b)=> a + (b<1e5 ? b : 0),0)

console.log("Solution part 1", sumOfDirs) //1444896

//Part 2: find the smallest directory, which if deleted, would result in free 
//disk space of at least 300k
console.log("Total space used", root.model.size)
console.log("Total free space (now)",  7e7 - root.model.size)
const neededSpace= 3e7-7e7+root.model.size;
console.log("Addi. free space (needed)", neededSpace)

const sizesSorted = dirSizes.sort((a,b)=>a-b)
console.log("Solution part 2", sizesSorted.find(size => size>= neededSpace))
