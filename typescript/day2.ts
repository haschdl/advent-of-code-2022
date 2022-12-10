import * as fs from 'fs';
let input = "input/day2-input.txt"

const data = fs.readFileSync(input, 'utf8').split("\n").map(e => e.split(" "));

//this converts X,Y,Z to A,B,C
type shape = "A" | "B" | "C"
type round = {player1: shape, player2: shape; points: number}
let dataPart1: round[] = data.map(e => ({player1:e[0] as shape, 
    player2:String.fromCharCode(e[1].charCodeAt(0) - 23) as shape, points:0}))


const points = (choice : shape ):number => {
    if (choice == "A" ) return 1; //1 for Rock
    if (choice == "B" ) return 2; //2 for Paper
    return 3; //3 for Scissors
}

const outcomeForPlayer2 = (p1:shape, p2:shape):number => {
    if (p1 === p2) return 3; //draw
    if (p2 === "A" && p1 === "C") return 6; //P2:Rock, P1:Scissors => P2 wins
    if (p2 === "B" && p1 === "A") return 6; //P2:Paper, P1:Rock=> P2 wins
    if (p2 === "C" && p1 === "B") return 6; //P2:Scissors, P1:Paper=> P2 wins
    return 0; //lost
}

dataPart1.forEach(e => e.points = outcomeForPlayer2(e.player1,e.player2) + points(e.player2))

//part 1 - Sum of points for player 2 (second column) (12772)
console.log("Solution part 1" ,dataPart1.reduce((a,b)=> a + b.points,0))


//part 2: the second column is the OUTCOME 11618
type outcome = "X" | "Y" | "Z";
type roundOutcome = {p1 : shape, outcome:outcome, shapeForOutcome:shape}

const shapeForOutcome = (p1 : shape, outcome: outcome): shape => {
    if(outcome === "Y") return p1; //draw
    if(outcome === "Z" && p1 === "A") return "B"; //p2 needs to win:
    if(outcome === "Z" && p1 === "B") return "C"; //p2 needs to win:
    if(outcome === "Z" && p1 === "C") return "A"; //p2 needs to win:
 
    if(outcome === "X" && p1 === "A") return "C"; //p2 needs to loose:
    if(outcome === "X" && p1 === "B") return "A"; 
    if(outcome === "X" && p1 === "C") return "B"; 
    return "B";
}

let dataPart2: roundOutcome[] = data.map(e => ({p1:e[0] as shape, outcome:e[1] as outcome, shapeForOutcome:shapeForOutcome(e[0] as shape,e[1] as outcome)}))

dataPart2.forEach(e => e.shapeForOutcome=shapeForOutcome(e.p1,e.outcome))

const points2 = (round:roundOutcome):number => outcomeForPlayer2(round.p1,round.shapeForOutcome) + points(round.shapeForOutcome)

//part 1 - Sum of points for player 2 (second column) 11618
console.log("Solution part 2" ,dataPart2.reduce((a,b)=> a + points2(b),0))

