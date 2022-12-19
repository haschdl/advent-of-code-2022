"use strict";
exports.__esModule = true;
exports.Range = void 0;
var Range = /** @class */ (function () {
    function Range() {
    }
    Range.from = function (endOrStart, end) {
        if (end == undefined)
            return Array.from(Array(Math.max(endOrStart, 0)), function (_, i) { return i; }); //negative numbers return []
        //if end < start returns empty
        return Array.from(Array(Math.max(end - endOrStart, 0)), function (_, i) { return endOrStart + i; });
    };
    ;
    Range.overlap = function (aStart, aEnd, bStart, bEnd) {
        if (aEnd >= aStart && bEnd >= bStart)
            return (aStart <= bEnd) && (aEnd >= bStart);
        throw ("Intervals must be ordered (aEnd must be >= aStart)");
    };
    ;
    return Range;
}());
exports.Range = Range;
