import { bitsToString } from "../lib/Binary";

export class Piece {

    /**
     * The shape as a series of integers, bottom-up
     */
    v: number[];
    readonly shape: number[];
    x: number;
    bottom: number;
    width: number;
    height: number;
    right: number;

    constructor(shape: number[], width: number, bottom: number) {
        this.shape = shape;

        this.width = width;
        //fix positions by making `this.x` positions to the right
        this.init();
        this.bottom = bottom; //initial position of bottom is 3 units above highest point (floor is at 0)
    }

    init(): void {
        this.v = this.shape.map(v => v >> 2);
        this.x = 2;
        this.updateRight();
        this.height = this.v.length;
    }


    private updateRight() {
        this.right = this.x + this.width;;
    }

    shifted(dir: "<" | ">") {
        if (dir === "<") {
            return [this.v[0] << 1, this.v[1] << 1, this.v[2] << 1, this.v[3] << 1];
        }
        return [this.v[0] >> 1, this.v[1] >> 1, this.v[2] >> 1, this.v[3] >> 1];
    }

    move(dir: "<" | ">") {
        if (dir === "<") {
            this.v[0] = this.v[0] << 1;
            this.v[1] = this.v[1] << 1;
            this.v[2] = this.v[2] << 1;
            this.v[3] = this.v[3] << 1;
            this.x--;
            this.updateRight();
            return;
        }
        this.v[0] = this.v[0] >> 1;
        this.v[1] = this.v[1] >> 1;
        this.v[2] = this.v[2] >> 1;
        this.v[3] = this.v[3] >> 1;
        this.x++;
        this.updateRight();
    }



    toString() {
        return bitsToString(this.v.slice().reverse(), 7, ".", "#");
    }


    clone(): Piece {
        let clone = new Piece(this.shape, this.width, this.bottom);
        clone.v = this.v.slice();
        return clone;
    }


};
