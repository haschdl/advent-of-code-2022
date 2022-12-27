

const printGrid = (arr: any, separator?: string, wrapper?: string): string => {

    const res: string[] = []
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
        b = arr.reduce((a, b) => a = `${a}${reduceItem(b)}\n`, "");
    else
        b = arr.reduce((a: string, b: string) => a = `${a}${b}${sep}`, "");

    return b;
}

/**
 * A Point, representing x and y coordinates.
 */
class Point {


    /**
     * Manhattan distance to point p.
     * @param p 
     */
    distM(p: Point) {
        return Math.abs(this.x - p.x) + Math.abs(this.y - p.y);
    }
    x: number;
    y: number;
    c: string; //for rendering;

    constructor(x = 0, y = 0, c?: string) {
        this.x = x;
        this.y = y;
        if (c) this.c = c;
    }
    equals = (p2: Point) => p2.x === this.x && p2.y === this.y;
    equalsInt = (p2: Point, i: number) => this.equals(p2) ? i : 1;
    addX = (x1: number) => new Point(this.x + x1, this.y);
    addY = (y1: number) => new Point(this.x, this.y + y1);
    /**
     * Returns a new instace of Point translated x1 and y1.
     * @param x1 
     * @param y1 
     * @returns 
     */
    add = (x1: number, y1: number) => new Point(this.x + x1, this.y + y1, this.c);
    setC = (c: string) => { this.c = c; return this; }
    clone = () => new Point(this.x, this.y, this.c);
    rect = (radius: number): Point[] => {
        const rect: Point[] = [];
        for (let x = -radius; x < radius; x++) {
            const y = radius - Math.abs(x);
            rect.push(this.clone().add(x, y));
            rect.push(this.clone().add(x, -y));
        }
        return rect;
    };
    rectFull = (radius: number): Point[] => {
        const rect: Point[] = [];
        while (radius > 0) {
            for (let x = -radius; x <= radius; x++) {
                const y = radius - Math.abs(x);
                rect.push(this.clone().add(x, y));
                rect.push(this.clone().add(x, -y));
            }
            radius--;
        }
        return rect;
    };

    /**
     * Updates coordinates to x and y of the `to` argument.
     * @param to 
     */
    moveTo(to: Point) {
        this.x = to.x;
        this.y = to.y;
    }
    toString = () => `${this.x},${this.y}`
    static parseString = (str: string) => new Point(Number(str.split(",")[0]), Number(str.split(",")[1]));
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
    const gridPrint: cell[][] = new Array(s).fill(0).map(() => new Array(s).fill("+"));
    grid.forEach((line) => line.forEach((v) => gridPrint[s - 1 - v.y + minY][v.x - minX] = "#"));
    return printGrid(gridPrint, "")
}

/**
 * 
 * Draw a grid of Points shifting the origin to the min/max of the points.
 * Origin is at top-left corner.
 */
const drawArrayOffSet = (source: Point[], highligh?: Point): string => {

    type cell = string;
    const grid = source.slice(0);
    if (highligh)
        grid.push(highligh)
    const [minX, maxX] = [Math.min(...grid.map(p => p.x)), Math.max(...grid.map(p => p.x))];
    const [minY, maxY] = [Math.min(...grid.map(p => p.y)), Math.max(...grid.map(p => p.y))];
    const sx = Math.abs(maxX - minX) + 1, sy = Math.abs(maxY - minY) + 1;
    const gridPrint: cell[][] = new Array(sy).fill(0).map(()=> new Array(sx).fill("."));
    grid.forEach((v) => gridPrint[v.y - minY][v.x - minX] = v.c);
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
export { Point, drawArrayOffSet,drawGridOffSet, printGrid, splitChunks }
