const printGrid = (arr: any, separator?: string, wrapper?: string) => {

    let res = ""
    let sep = "\t";

    if (separator !== undefined)
        sep = separator


    const reduceItem = (item: any) => {
        if (Array.isArray(item))
            return item.reduce((a, b) => a = `${a}${sep}${b}`, "")
        return item;
    }
    //naive check for array of arrays
    if (Array.isArray(arr[0]))
        res = arr.reduce((a: string, b: string) => a = `${a}\n${reduceItem(b)}`, "");
    else
        res = arr.reduce((a: string, b: string) => a = `${a}${b}${sep}`, "")

    console.log(res)
}

/**
 * A Point, representing x and y coordinates.
 */
class Point {
    x: number;
    y: number;
}

/**
 * 
 * Draw a grid of Points shifting the origin to the min/max of the points.
 */
const drawGridOffSet = (points: Point[][]) => {
    type cell = string;
    const [minX, maxX] = [Math.min(...points.map(p => p.x)), Math.max(...points.map(p => p.x))];
    const [minY, maxY] = [Math.min(...points.map(p => p.y)), Math.max(...points.map(p => p.y))];
    const s = Math.max(Math.abs(maxX - minX), Math.abs(maxY - minY)) + 1;
    let grid: cell[][] = new Array(s).fill(0).map(_ => new Array(s).fill("+"));
    points.forEach(p => grid[s - 1 - p.y + minY][p.x - minX] = "#")
    printGrid(grid)
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
export { Point, drawGridOffSet, printGrid, splitChunks }
