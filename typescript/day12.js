"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const utils_1 = require("./utils");
let input = "input/day12-input.txt";
const ch = (c) => c.charCodeAt(0);
const rawData = fs.readFileSync(input, 'utf8').split("\n").map(i => i.split(""));
const n = rawData.length, m = rawData[0].length;
const heights = rawData.map(r => r.map(o => ch(o)));
const debug = false;
const start = [0, 20];
const end = [43, 20];
const h = (p) => heights[p[0]][p[1]];
const canMove = (from, to) => h(to) == h(from) + 1;
const moves = (p) => {
    const neigh = (0, utils_1.splitChunks)([-1, -1, -1, 0, -1, 1, 1, 0, 1, 1, 0, 1, -1, 1, -1, 0], 2);
    let r = [];
    neigh.forEach((v) => r.push([p[0] - v[0], p[1] - v[1]]));
    r = r.filter(r => r[0] > 0 && r[0] < n && r[1] > 0 && r[1] < m);
    return r.filter(r => canMove(p, r));
};
(0, utils_1.printGrid)(rawData, "");
//# sourceMappingURL=day12.js.map