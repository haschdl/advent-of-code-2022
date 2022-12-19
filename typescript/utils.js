"use strict";
exports.__esModule = true;
exports.splitChunks = exports.printGrid = exports.drawArrayOffSet = exports.Point = void 0;
var printGrid = function (arr, separator, wrapper) {
    var res = [];
    var sep = "\t";
    var b = "";
    if (separator !== undefined)
        sep = separator;
    var reduceItem = function (item) {
        if (Array.isArray(item))
            return item.reduce(function (a, b) { return a = "".concat(a).concat(sep).concat(b); }, "");
        return item;
    };
    //naive check for array of arrays
    if (Array.isArray(arr[0]))
        b = arr.reduce(function (a, b) { return a = "".concat(a).concat(reduceItem(b), "\n"); }, "");
    else
        b = arr.reduce(function (a, b) { return a = "".concat(a).concat(b).concat(sep); }, "");
    return b;
};
exports.printGrid = printGrid;
/**
 * A Point, representing x and y coordinates.
 */
var Point = /** @class */ (function () {
    function Point(x, y, c) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var _this = this;
        this.equals = function (p2) { return p2.x === _this.x && p2.y === _this.y; };
        this.equalsInt = function (p2, i) { return _this.equals(p2) ? i : 1; };
        this.addX = function (x1) { return new Point(_this.x + x1, _this.y); };
        this.addY = function (y1) { return new Point(_this.x, _this.y + y1); };
        this.add = function (x1, y1) { return new Point(_this.x + x1, _this.y + y1); };
        this.setC = function (c) { _this.c = c; return _this; };
        this.clone = function () { return new Point(_this.x, _this.y); };
        this.rect = function (radius) {
            var rect = [];
            for (var x = -radius; x < radius; x++) {
                var y = radius - Math.abs(x);
                rect.push(_this.clone().add(x, y));
                rect.push(_this.clone().add(x, -y));
            }
            return rect;
        };
        this.rectFull = function (radius) {
            var rect = [];
            while (radius > 0) {
                for (var x = -radius; x <= radius; x++) {
                    var y = radius - Math.abs(x);
                    rect.push(_this.clone().add(x, y));
                    rect.push(_this.clone().add(x, -y));
                }
                radius--;
            }
            return rect;
        };
        this.toString = function () { return "[".concat(_this.x, ",").concat(_this.y, "]"); };
        this.x = x;
        this.y = y;
        if (c)
            this.c = c;
    }
    /**
     * Manhattan distance to point p.
     * @param p
     */
    Point.prototype.distM = function (p) {
        return Math.abs(this.x - p.x) + Math.abs(this.y - p.y);
    };
    return Point;
}());
exports.Point = Point;
/**
 *
 * Draw a grid of Points shifting the origin to the min/max of the points.
 */
var drawGridOffSet = function (grid) {
    var _a = [Math.min.apply(Math, grid.flatMap(function (ps) { return ps.map(function (p) { return p.x; }); })), Math.max.apply(Math, grid.flatMap(function (ps) { return ps.map(function (p) { return p.x; }); }))], minX = _a[0], maxX = _a[1];
    var _b = [Math.min.apply(Math, grid.flatMap(function (ps) { return ps.map(function (p) { return p.y; }); })), Math.max.apply(Math, grid.flatMap(function (ps) { return ps.map(function (p) { return p.y; }); }))], minY = _b[0], maxY = _b[1];
    var s = Math.max(Math.abs(maxX - minX), Math.abs(maxY - minY)) + 1;
    var gridPrint = new Array(s).fill(0).map(function (_) { return new Array(s).fill("+"); });
    grid.forEach(function (line, y) { return line.forEach(function (v, x) { return gridPrint[s - 1 - v.y + minY][v.x - minX] = "#"; }); });
    return printGrid(gridPrint, "");
};
/**
 *
 * Draw a grid of Points shifting the origin to the min/max of the points.
 * Origin is at top-left corner.
 */
var drawArrayOffSet = function (source, highligh) {
    var grid = source.slice(0);
    if (highligh)
        grid.push(highligh);
    var _a = [Math.min.apply(Math, grid.map(function (p) { return p.x; })), Math.max.apply(Math, grid.map(function (p) { return p.x; }))], minX = _a[0], maxX = _a[1];
    var _b = [Math.min.apply(Math, grid.map(function (p) { return p.y; })), Math.max.apply(Math, grid.map(function (p) { return p.y; }))], minY = _b[0], maxY = _b[1];
    var sx = Math.abs(maxX - minX) + 1, sy = Math.abs(maxY - minY) + 1;
    var gridPrint = new Array(sy).fill(0).map(function (_) { return new Array(sx).fill("."); });
    grid.forEach(function (v, x) { return gridPrint[v.y - minY][v.x - minX] = v.c; });
    if (highligh)
        gridPrint[highligh.y - minY][highligh.x - minX] = "+";
    return printGrid(gridPrint, "");
};
exports.drawArrayOffSet = drawArrayOffSet;
var splitChunks = function (arr, chunkSize) {
    return arr.reduce(function (resultArray, item, index) {
        var chunkIndex = Math.floor(index / chunkSize);
        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []; // start a new chunk
        }
        resultArray[chunkIndex].push(item);
        return resultArray;
    }, []);
};
exports.splitChunks = splitChunks;
