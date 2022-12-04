// Read the file and print its contents.
const fs = require('fs');
let input = "day2-input.txt"

const data = fs.readFileSync(input, 'utf8').split("\n").map(e => e.split(" "));
//this converts X,Y,Z to A,B,C
let dataPart1 = data.map(e => [e[0], String.fromCharCode(e[1].charCodeAt(0) - 23)])

const points = (choice) => {
    if (choice == "A" ) return 1; //1 for Rock
    if (choice == "B" ) return 2; //2 for Paper
    if (choice == "C" ) return 3; //3 for Scissors
}
const outcomeForPlayer2 = (p1, p2) => {
    if (p1 === p2) return 3; //draw
    if (p2 === "A" && p1 === "C") return 6; //P2:Rock, P1:Scissors => P2 wins
    if (p2 === "B" && p1 === "A") return 6; //P2:Paper, P1:Rock=> P2 wins
    if (p2 === "C" && p1 === "B") return 6; //P2:Scissors, P1:Paper=> P2 wins
    return 0; //lost
}

dataPart1 = dataPart1.map(e => [...e, outcomeForPlayer2(...e) + points(e[1])])

//part 1 - Sum of points for player 2 (second column) (12772)
console.log("Solution part 1" ,dataPart1.reduce((a,b)=> a + b[2],0))


//part 2: the second column is the OUTCOME
const shapeForOutcome = (p1, outcome) => {
    if(outcome === "Y") return p1; //draw
    if(outcome === "Z" && p1 === "A") return "B"; //p2 needs to win:
    if(outcome === "Z" && p1 === "B") return "C"; //p2 needs to win:
    if(outcome === "Z" && p1 === "C") return "A"; //p2 needs to win:
 
    if(outcome === "X" && p1 === "A") return "C"; //p2 needs to loose:
    if(outcome === "X" && p1 === "B") return "A"; 
    if(outcome === "X" && p1 === "C") return "B"; 

}


let dataPart2 = data.map(e => [...e, shapeForOutcome(...e)])
dataPart2 = dataPart2.map(e => [...e, outcomeForPlayer2(e[0],e[2]) + points(e[2])])

//part 1 - Sum of points for player 2 (second column) (7657: too low)
console.log("Solution part 2" ,dataPart2.reduce((a,b)=> a + b[3],0))

