/**
 * Notes to self:
 * 
 *  I spent too much time wrestling with array just to avoid the hastle of using LinkedList, even
 *  though it was a quite evident case for LinkedList.
 *  
 *  Then once again I spent too long trying to produce the exact output, instead of going for matching the 
 *  answer for the sample data.
 * 
 *  A good example was not noticing that the starting number of the sequence after "mixing" doesn't matter,
 *  as long as they follow the same order (so [0,3,4,5] produces the same answer as [4,5,0,3]). The clue
 *  was at "Then, the grove coordinates can be found by looking at the 1000th, 2000th, and 3000th numbers after the value 0,
 *  wrapping around the list as necessary."
 * 
 *  TL;DR: Don't try to reproduce the output; try to match the sample answer, if the intermediate results are not the same.
 * 
 */
import * as fs from 'fs';
import LinkedList from 'ts-linked-list';
import LinkedListNode from 'ts-linked-list/dist/LinkedListNode';

import { Range } from '../lib/Range'
const input = "input/day20-input.txt";


const rawData: number[] = fs.readFileSync(input, 'utf8').split("\n").map(s => Number(s));

type n_p = { ix: number, v: number };


// x is present in linked list
function search<T>(list: LinkedList<T>, predicate: (element: T) => boolean): LinkedListNode<T> | undefined {
    let current = list.head; // Initialize current
    while (current != null) {
        if (predicate(current.data))
            return current; // data found
        current = current.next;
    }
    return undefined; // data not found
}

const mix = (original: LinkedList<n_p>, input: LinkedList<n_p>): LinkedList<n_p> => {

    //const out = new LinkedList(...input.toArray());
    const N = input.length - 1;

    for (let i = 0; i < input.length; i++) {

        //locate the next item to be moved, by the original index
        const next = search(input, e => e.ix == i);

        if (next == undefined)
            throw "Ooops"


        //negative should loop: there is a smarter way but I couldnt figure it out
        let d = next.data.v % (N);
        if (d < 0) {
            let moveBefore: LinkedListNode<n_p> | null = next;
            let append = false;

            while (d < 0) {
                if (append) {
                    moveBefore = input.tail;
                    append = false;
                }
                else {
                    if (moveBefore?.prev == null) { //it is head
                        moveBefore = input.tail;
                    }
                    else if (moveBefore?.prev.prev == null) { // it is first node (after head)
                        append = true;
                    }
                    else moveBefore = moveBefore.prev;
                }
                d++;
            }
            input.removeNode(next);
            if (append) { //if next would be tail, then make it a head by prepend
                input.append(next.data);
            }
            else {
                if (moveBefore == null)
                    throw "OOps";
                input.insertBefore(moveBefore, next.data);
            }
        }
        else if (d > 0) {
            let moveAfter: LinkedListNode<n_p> | null = next;
            let prepend = false;
            while (d > 0) {

                if (prepend) {
                    moveAfter = input.head;
                    prepend = false;
                }
                else {
                    if (moveAfter?.next == null) {
                        moveAfter = input.head;
                    }
                    else if (moveAfter?.next.next == null) {
                        prepend = true;
                    }
                    else moveAfter = moveAfter.next;
                }
                d--;
            }
            input.removeNode(next);
            if (prepend) { //if next would be tail, then make it a head by prepend
                input.prepend(next.data);
            }
            else {
                if (moveAfter == null)
                    throw "OOps";
                input.insertAfter(moveAfter, next.data);
            }
        }
        //console.log(`reorder of ${next.data.v} m=${next.data.v % (N)} \t\t ${input.map(o => o.v)}`)
    }
    return input;
}
const coord = (ordered: LinkedList<n_p>): number[] => {
    const n = ordered.length;
    const z0 = ordered.findIndex(o => o.v == 0);
    const coord = Range.from(1, 4).map(v => ordered.toArray()[(z0 + v * 1000) % n].v);
    return coord;
}

console.log("********************************************************")
console.log("********************* PART 1 ***************************")
console.log("********************************************************")

//Then, the grove coordinates can be found by looking at the 1000th, 
//2000th, and 3000th numbers after the value 0, wrapping around the list as necessary.

const unorder = new LinkedList(...rawData.map((v, ix) => ({ ix: ix, v: v })));
const part1 = mix(unorder, unorder); //since part 1 is only one round, it doesn't matter that unorder is reused
const coord1 = coord(part1);
const sol1 = coord1.reduce((a, b) => a + b, 0);

console.log("Coordinates part 1", coord1); //7255 too low
console.log("Solution part 1", sol1); //7255 too low
//assert(sol1==17490)


console.log("********************************************************")
console.log("********************* PART 2 ***************************")
console.log("********************************************************")

const key = 811589153;

const original = new LinkedList(...rawData.map((v, ix) => ({ ix: ix, v: v * key})));
const unordered = new LinkedList(...rawData.map((v, ix) => ({ ix: ix, v: v * key })));
console.log(unordered.toArray().map(v => v.v))
let part2;
for (let i = 1; i <= 10; i++) {
    part2 = mix(original, unordered);
    console.log(`After ${i} round of mixing`, part2.toArray().map(o => o.v));
}
const coord2 = coord(part2);
const sol2 = coord2.reduce((a, b) => a + b, 0);

console.log("Coordinates part 2", coord2);
console.log("Solution part 2", sol2); //1632917375836