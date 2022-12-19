/**
 * Returns true if the n-th bit is 1 for a given number in its binary.
 * representation. For example, 17 in binary is `10010`.
 * 
 * Example:
 * ````
 * isBitSet(17, 0)
 * 0
 * isBitSet(17, 1)
 * 1
 * isBitSet(17, 4)
 * 1
 * @param number A number
 * @param n The 0-based position 
 * @returns 
 */
export const isBitSet = (number: number, n: number) => (number & (1 << n)) != 0;




export const bitsToString = (number: number | number[], padding?: number, charZero?: string, charOne?: string) => {
    if (number === undefined)
        throw "`number` must be of type number of number[]";

    const singleNumberToString = (n: number, nBits: number) => {
        let res = "";
        for (let i = 0; i < nBits; i++) {
            if (isBitSet(n, nBits - i - 1))
                res += charOne || "#";
            else
                res += charZero || ".";
        }
        return res;
    }


    let nBits = 0;
    if (padding !== undefined)
        nBits = padding;
    //TODO is there a better way?
    else    
        nBits = number.toString(2).length; //the number of digits in the binary representation of the number


    if (typeof number === "number")
        return singleNumberToString(number, nBits);

    //number is array
    return number.map((n, y) => {
        let line = bitsToString(n || 0, 7, ".", "#");
        return line;
    }).join("\n");
}