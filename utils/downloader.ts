// Read the file and print its contents.
import * as fs from 'fs';
import path from 'node:path';

require('dotenv').config()

main(process.argv);

async function main(args) {
    const day = args[2];
    const USER_AGENT_HEADER = {
        "User-Agent": "github.com/haschdl/advent-of-code-2022 by h.abude@gmail.com",
      }
    let rawData: string;
    let input = path.resolve(`${__dirname}/../input/day${day}-input.txt`)
    if (fs.existsSync(input)) {
        rawData = fs.readFileSync(input, 'utf8')
        console.log("File already exists!", input)
    }
    else {
        console.log("Downloading puzzle input for day ", day)
        const res = await fetch(`https://adventofcode.com/2022/day/${day}/input`,{
            headers: {
              cookie: `session=${process.env.AOC_SESSION_KEY}`,
              ...USER_AGENT_HEADER,
            }})
        const txt = await res.text();
        fs.writeFileSync(input, txt)
        rawData = txt;
    }
}