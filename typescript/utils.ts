import { fstat } from "node:fs";

const printGrid = (arr: any, separator?: string, wrapper?: string):string => {

    let res: string[] = []
    let sep = "\t";
    let b = "";

    if (separator !== undefined)
        sep = separator


    const reduceItem = (item: any) => {
        if (Array.isArray(item))
            return item.reduce((a, b) => a = `${a}${sep}${b}`, "")
        return item;
    }

    //naive check for array of arrays
    if (Array.isArray(arr[0]))
        b = arr.reduce((a,b) => a = `${a}${reduceItem(b)}\n`,"");
    else
        b = arr.reduce((a: string, b: string) => a = `${a}${b}${sep}`, "");
    
    return b;
}

/**
 * A Point, representing x and y coordinates.
 */
class Point {
    x: number;
    y: number;
    c: string; //for rendering;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    equals = (p2: Point) => p2.x === this.x && p2.y === this.y;
    equalsInt = (p2: Point, i:number) => this.equals(p2) ? i: 1;
    addX = (x1: number) => new Point(this.x + x1, this.y);
    addY = (y1: number) => new Point(this.x, this.y + y1);
    add = (x1: number, y1: number) => new Point(this.x + x1, this.y + y1);
    setC = (c: string) => { this.c = c; return this; }
    clone = () => new Point(this.x, this.y);
}

/**
 * 
 * Draw a grid of Points shifting the origin to the min/max of the points.
 */
const drawGridOffSet = (grid: Point[][]) => {
    type cell = string;
    const [minX, maxX] = [Math.min(...grid.flatMap(ps => ps.map(p => p.x))), Math.max(...grid.flatMap(ps => ps.map(p => p.x)))];
    const [minY, maxY] = [Math.min(...grid.flatMap(ps => ps.map(p => p.y))), Math.max(...grid.flatMap(ps => ps.map(p => p.y)))];
    const s = Math.max(Math.abs(maxX - minX), Math.abs(maxY - minY)) + 1;
    let gridPrint: cell[][] = new Array(s).fill(0).map(_ => new Array(s).fill("+"));
    grid.forEach((line, y) => line.forEach((v, x) => gridPrint[s - 1 - v.y + minY][v.x - minX] = "#"));
    return printGrid(gridPrint, "")
}

/**
 * 
 * Draw a grid of Points shifting the origin to the min/max of the points.
 * Origin is at top-left corner.
 */
const drawArrayOffSet = (source: Point[], highligh?: Point): string => {

    type cell = string;
    let grid = source.slice(0);
    if (highligh)
        grid.push(highligh)
    const [minX, maxX] = [Math.min(...grid.map(p => p.x)), Math.max(...grid.map(p => p.x))];
    const [minY, maxY] = [Math.min(...grid.map(p => p.y)), Math.max(...grid.map(p => p.y))];
    const sx = Math.abs(maxX - minX)+1,sy= Math.abs(maxY - minY)+ 1;
    let gridPrint: cell[][] = new Array(sy).fill(0).map(_ => new Array(sx).fill("."));
    grid.forEach((v, x) => gridPrint[v.y - minY][v.x - minX] = v.c);
    if (highligh)
        gridPrint[highligh.y - minY][highligh.x - minX] = "+";

    return printGrid(gridPrint, "");

}


const splitChunks = (arr: any[], chunkSize: number) => {
    return arr.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / chunkSize);

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
        }

        resultArray[chunkIndex].push(item)

        return resultArray
    }, [])
}
export { Point, drawArrayOffSet, printGrid, splitChunks }
