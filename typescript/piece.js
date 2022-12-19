"use strict";
exports.__esModule = true;
exports.Piece = void 0;
var Binary_1 = require("../lib/Binary");
var Piece = /** @class */ (function () {
    function Piece(shape, width, bottom) {
        this.shape = shape;
        this.width = width;
        //fix positions by making `this.x` positions to the right
        this.init();
        this.bottom = bottom; //initial position of bottom is 3 units above highest point (floor is at 0)
    }
    Piece.prototype.init = function () {
        this.v = this.shape.map(function (v) { return v >> 2; });
        this.x = 2;
        this.updateRight();
        this.height = this.v.length;
    };
    Piece.prototype.updateRight = function () {
        this.right = this.x + this.width;
        ;
    };
    Piece.prototype.shifted = function (dir) {
        if (dir === "<") {
            return [this.v[0] << 1, this.v[1] << 1, this.v[2] << 1, this.v[3] << 1];
        }
        return [this.v[0] >> 1, this.v[1] >> 1, this.v[2] >> 1, this.v[3] >> 1];
    };
    Piece.prototype.move = function (dir) {
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
    };
    Piece.prototype.toString = function () {
        return (0, Binary_1.bitsToString)(this.v.slice().reverse(), 7, ".", "#");
    };
    Piece.prototype.clone = function () {
        var clone = new Piece(this.shape, this.width, this.bottom);
        clone.v = this.v.slice();
        return clone;
    };
    return Piece;
}());
exports.Piece = Piece;
;
