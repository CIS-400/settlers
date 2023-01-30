/**
 * An undirected, weighted, simple graph with a fixed number of nodes (created on initialization)
 * implemented with an adjacency list. The graph can store anything. **Note**, internally uses === to
 * check for equality.
 */
export declare class Graph<T> {
    /** Internal adjacency matrix */
    private al;
    /** Internal mapping of an element to its index. Used to index adjacency list. */
    private keys;
    /**
     * @param nodes A list of nodes that are in the graph.
     */
    constructor(nodes: T[]);
    /**
     * @param edges A list of string tuples [a, b] representing
     * that an edge existing between a and b
     */
    constructor(edges: [T, T][]);
    private keyOf;
    hasNode: (v: T) => boolean;
    hasEdge: (u: T, v: T) => boolean;
    addEdge(u: T, v: T, w?: number): void;
    deleteEdge(u: T, v: T): void;
    getWeight(u: T, v: T): number;
    setWeight(u: T, v: T, w: number): void;
    degree: (u: T) => number;
    children: (u: T) => T[];
    nodeCount: () => number;
    nodes: () => T[];
    edgeCount: () => number;
}
export default Graph;
