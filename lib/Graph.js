"use strict";
exports.__esModule = true;
var Graph = /** @class */ (function () {
    function Graph() {
        this.vertices = [];
        this.adjacent = [];
        this.edges = 0;
    }
    Graph.prototype.addVertex = function (vNumberOrArray) {
        var _this = this;
        if (Array.isArray(vNumberOrArray)) {
            vNumberOrArray.forEach(function (v) {
                _this.vertices.push(v);
                _this.adjacent[v] = [];
            });
            return;
        }
        this.vertices.push(vNumberOrArray);
        this.adjacent[vNumberOrArray] = [];
    };
    Graph.prototype.addEdge = function (vix, wix) {
        this.adjacent[vix].push(wix);
        //this.adjacent[wix].push(vix);
        this.edges++;
    };
    Graph.prototype.bfs = function (goalNumberOrPredicate, root) {
        var _this = this;
        if (root === void 0) { root = this.vertices[0]; }
        var goal = function (v, distance) {
            if (typeof goalNumberOrPredicate === "number")
                return v == goalNumberOrPredicate;
            return goalNumberOrPredicate(distance, _this.vertices);
        };
        var adj = this.adjacent;
        var queue = [];
        queue.push(root);
        var discovered = [];
        discovered[root] = true;
        var edges = [];
        edges[root] = 0;
        var predecessors = [];
        predecessors[root] = -1;
        var buildPath = function (goal, root, predecessors) {
            var stack = [];
            stack.push(goal);
            var u = predecessors[goal];
            while (u != root && u > 0) {
                stack.push(u);
                u = predecessors[u];
            }
            stack.push(root);
            var path = stack.reverse(); //.join('-');
            return path;
        };
        while (queue.length) {
            var v = queue.shift();
            if (v !== undefined) {
                var distance = edges[v];
                if (goal(v, distance)) {
                    return {
                        distance: distance,
                        path: buildPath(v, root, predecessors)
                    };
                }
                for (var i = 0; i < adj[v].length; i++) {
                    if (!discovered[adj[v][i]]) {
                        discovered[adj[v][i]] = true;
                        queue.push(adj[v][i]);
                        edges[adj[v][i]] = edges[v] + 1;
                        predecessors[adj[v][i]] = v;
                    }
                }
            }
        }
        return false;
    };
    return Graph;
}());
exports["default"] = Graph;
