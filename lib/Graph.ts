type goalPredicate = (distance: number, vertices: number[]) => boolean;

type BFS_Result = { distance: number, path: number[] } | boolean;

export default class Graph {
    vertices: number[];
    adjacent: number[][];
    edges: number;
    constructor() {
        this.vertices = [];
        this.adjacent = [];
        this.edges = 0;
    }

    addVertex(vs: number[]): void;
    addVertex(v: number): void;
    addVertex(vNumberOrArray: number | number[]): void {
        if (Array.isArray(vNumberOrArray)) {
            vNumberOrArray.forEach(v => {
                this.vertices.push(v);
                this.adjacent[v] = [];
            });
            return;
        }
        this.vertices.push(vNumberOrArray);
        this.adjacent[vNumberOrArray] = [];
    }

    addEdge(vix: number, wix: number) {
        this.adjacent[vix].push(wix);
        //this.adjacent[wix].push(vix);
        this.edges++;
    }

    bfs(goal: goalPredicate, root: number): BFS_Result;
    bfs(goal: number, root: number): BFS_Result;
    bfs(goalNumberOrPredicate: number | goalPredicate, root = this.vertices[0]): BFS_Result {
        const goal = (v: number, distance: number) => {
            if (typeof goalNumberOrPredicate === "number")
                return v == goalNumberOrPredicate;

            return goalNumberOrPredicate(distance, this.vertices)
        }
        let adj = this.adjacent;

        const queue: number[] = [];
        queue.push(root);

        const discovered: boolean[] = [];
        discovered[root] = true;

        const edges: number[] = [];
        edges[root] = 0;

        const predecessors: number[] = [];
        predecessors[root] = -1;

        const buildPath = (goal: number, root: number, predecessors: number[]) => {
            const stack: number[] = [];
            stack.push(goal);

            let u = predecessors[goal];

            while (u != root && u > 0) {
                stack.push(u);
                u = predecessors[u];
            }

            stack.push(root);

            let path = stack.reverse();//.join('-');

            return path;
        }


        while (queue.length) {
            let v = queue.shift();
            if (v !== undefined) {

                const distance = edges[v];

                if (goal(v,distance)) {
                    return {
                        distance: distance,
                        path: buildPath(v, root, predecessors)
                    };
                }

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

