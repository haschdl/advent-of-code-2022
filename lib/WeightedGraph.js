"use strict";
exports.__esModule = true;
exports.WeightedGraph = void 0;
//helper class for PriorityQueue
/**
 *
 */
var Node = /** @class */ (function () {
    function Node(val, priority) {
        this.val = val;
        this.priority = priority;
    }
    return Node;
}());
var PriorityQueue = /** @class */ (function () {
    function PriorityQueue() {
        this.values = [];
    }
    PriorityQueue.prototype.enqueue = function (val, priority) {
        var newNode = new Node(val, priority);
        this.values.push(newNode);
        this.bubbleUp();
    };
    PriorityQueue.prototype.bubbleUp = function () {
        var idx = this.values.length - 1;
        var element = this.values[idx];
        while (idx > 0) {
            var parentIdx = Math.floor((idx - 1) / 2);
            var parent_1 = this.values[parentIdx];
            if (element.priority >= parent_1.priority)
                break;
            this.values[parentIdx] = element;
            this.values[idx] = parent_1;
            idx = parentIdx;
        }
    };
    PriorityQueue.prototype.dequeue = function () {
        var min = this.values[0];
        var end = this.values.pop();
        if (this.values.length > 0 && end) {
            this.values[0] = end;
            this.sinkDown();
        }
        return min;
    };
    PriorityQueue.prototype.sinkDown = function () {
        var idx = 0;
        var length = this.values.length;
        var element = this.values[0];
        while (true) {
            var leftChildIdx = 2 * idx + 1;
            var rightChildIdx = 2 * idx + 2;
            var leftChild = undefined;
            var rightChild = void 0;
            var swap = -1;
            if (leftChildIdx < length) {
                leftChild = this.values[leftChildIdx];
                if (leftChild.priority < element.priority) {
                    swap = leftChildIdx;
                }
            }
            if (rightChildIdx < length) {
                rightChild = this.values[rightChildIdx];
                if (leftChild !== undefined) {
                    if ((swap === null && rightChild.priority < element.priority) ||
                        (swap !== null && rightChild.priority < leftChild.priority)) {
                        swap = rightChildIdx;
                    }
                }
            }
            if (swap === -1)
                break;
            this.values[idx] = this.values[swap];
            this.values[swap] = element;
            idx = swap;
        }
    };
    return PriorityQueue;
}());
/**
 *Dijkstra algorithm is used to find the shortest distance between two nodes inside a valid weighted graph.
 * Often used in Google Maps, Network Router etc.
 * Dijkstra's algorithm only works on a weighted graph.
 * Example:
var graph = new WeightedGraph();
graph.addVertex("A");
graph.addVertex("B");
graph.addVertex("C");
graph.addVertex("D");
graph.addVertex("E");
graph.addVertex("F");
 
graph.addEdge("A", "B", 4);
graph.addEdge("A", "C", 2);
graph.addEdge("B", "E", 3);
graph.addEdge("C", "D", 2);
graph.addEdge("C", "F", 4);
graph.addEdge("D", "E", 3);
graph.addEdge("D", "F", 1);
graph.addEdge("E", "F", 1);
 
console.log(graph.Dijkstra("A", "E"));
 */
var WeightedGraph = /** @class */ (function () {
    function WeightedGraph() {
        this.adjacencyList = {};
    }
    WeightedGraph.prototype.addVertex = function (vertex) {
        if (!this.adjacencyList[vertex])
            this.adjacencyList[vertex] = [];
    };
    WeightedGraph.prototype.addEdge = function (vertex1, vertex2, weight) {
        this.adjacencyList[vertex1].push({ node: vertex2, weight: weight });
        this.adjacencyList[vertex2].push({ node: vertex1, weight: weight });
    };
    WeightedGraph.prototype.Dijkstra = function (start, finish) {
        var nodes = new PriorityQueue();
        var distances = {};
        var previous = {};
        var path = []; //to return at end
        var smallest = Infinity;
        //build up initial state
        for (var vertexKey in this.adjacencyList) {
            var vertex = Number(vertexKey);
            if (vertex === start) {
                distances[vertex] = 0;
                nodes.enqueue(vertex, 0);
            }
            else {
                distances[vertex] = Infinity;
                nodes.enqueue(vertex, Infinity);
            }
            previous[vertex] = null;
        }
        // as long as there is something to visit
        while (nodes.values.length) {
            smallest = nodes.dequeue().val;
            if (smallest === finish) {
                //WE ARE DONE
                //BUILD UP PATH TO RETURN AT END
                while (previous[smallest]) {
                    path.push(smallest);
                    smallest = previous[smallest];
                }
                break;
            }
            if (smallest || distances[smallest] !== Infinity) {
                for (var neighbor in this.adjacencyList[smallest]) {
                    //find neighboring node
                    var nextNode = this.adjacencyList[smallest][neighbor];
                    //calculate new distance to neighboring node
                    var candidate = distances[smallest] + nextNode.weight;
                    var nextNeighbor = nextNode.node;
                    if (candidate < distances[nextNeighbor]) {
                        //updating new smallest distance to neighbor
                        distances[nextNeighbor] = candidate;
                        //updating previous - How we got to neighbor
                        previous[nextNeighbor] = smallest;
                        //enqueue in priority queue with new priority
                        nodes.enqueue(nextNeighbor, candidate);
                    }
                }
            }
        }
        return path.concat(smallest).reverse();
    };
    return WeightedGraph;
}());
exports.WeightedGraph = WeightedGraph;
