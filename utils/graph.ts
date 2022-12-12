export default class Graph {
    vertices: number[];
    adjacent: number[][];
    edges: number;
    constructor() {
        this.vertices = [];
        this.adjacent = [];
        this.edges = 0;
    }

    addVertex(v: number) {
        this.vertices.push(v);
        this.adjacent[v] = [];
    }

    addEdge(vix: number, wix:number) {
        this.adjacent[vix].push(wix);
        //this.adjacent[wix].push(vix);
        this.edges++;
    }

    bfs(goal: number, root = this.vertices[0]) {
        let adj = this.adjacent;

        const queue: number[] = [];
        queue.push(root);

        const discovered: boolean[] = [];
        discovered[root] = true;

        const edges: number[] = [];
        edges[root] = 0;

        const predecessors: number[] = [];
        predecessors[root] = -1;

        const buildPath = (goal: number, root: number, predecessors:number[]) => {
            const stack: number[] = [];
            stack.push(goal);

            let u = predecessors[goal];

            while (u != root && u>0) {
                stack.push(u);
                u = predecessors[u];
            }

            stack.push(root);

            let path = stack.reverse().join('-');

            return path;
        }


        while (queue.length) {
            let v = queue.shift();

            if (v === goal) {
                return {
                    distance: edges[goal],
                    path: buildPath(goal, root, predecessors)
                };
            }
            if (v!==undefined) {
                for (let i = 0; i < adj[v].length; i++) {
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
    }
}