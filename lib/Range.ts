export class Range {

    /**
     * Generates an array of integers containing `len` items , starting from `start.
     * The sequence goes from `start` to `end-1` (excludes `end`).
     * Example:
     * `Range.i(1,5)`
     * `[1,2,3,4]`
     *  from = function from(start: number=0, end: number) { Array.from(Array(end - start), (_, i) => start + i )};
     * @param start Start of the range
     * @param end End of the range (not-inclusive)
     * @returns 
     */
    public static from(end: number): number[];
    public static from(start: number, end: number): number[];
    public static from(endOrStart: number, end?: number): number[] {
        if (end == undefined)
            return Array.from(Array(Math.max(endOrStart, 0)), (_, i) => i); //negative numbers return []

        //if end < start returns empty
        return Array.from(Array(Math.max(end - endOrStart, 0)), (_, i) => endOrStart + i);

    };


    public static overlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
        if (aEnd >= aStart && bEnd >= bStart)
            return (aStart <= bEnd) && (aEnd >= bStart);

        throw ("Intervals must be ordered (aEnd must be >= aStart)");
    };

}