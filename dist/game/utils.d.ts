/**
 * Defines a set of utility functions & classes for logic for math, strings, etc.
 * @module
 */
import Graph from './board/graph';
/**
 * Returns a index from a weighted array.
 * @param weights An array of weights
 * @return The index to remove or -1 if no such index if weights are 0 or
 * array is empty.
 */
export declare const weightedRandom: (weights: number[]) => number;
/**
 * Roll a die.
 * @returns A uniform int on [1, 6]
 */
export declare const rollDie: () => number;
/**
 * @returns A uniform int on [lo, hi]
 */
export declare const uniformRandom: (lo: number, hi: number) => number;
/**
 * A recursive helper function to find the max trail.
 * @param v The current node.
 * @param g The graph.
 * @param seen A list of edges already visited.
 * @returns The length of the max trail.
 */
export declare function maxTrailRec<T>(v: T, g: Graph<T>, seen: Graph<T>): number;
/**
 * maxTrail explores every possible trail that starts at node `src` and
 * return the max length of all trials.
 * @param g The graph.
 * @param src The starting node.
 */
export declare const maxTrail: <T>(g: Graph<T>, src: T) => number;
/**
 * Get a list of graphs that are the connected components of graph `g`.
 * @param g The graph.
 * @returns A list of ccs.
 */
export declare const connectedComponents: <T>(g: Graph<T>) => Graph<T>[];
export interface BFSTraveral<T> {
    visited: Set<T>;
    depth: number;
}
/**
 * Run BFS on a graph from a source.
 * @param g The graph.
 * @param src The source elt.
 * @returns A BFS traversal object that includes a list of visited graph elts
 * and the max depth of the BFS tree.
 */
export declare const breadthFirstSearch: <T>(g: Graph<T>, src: T) => BFSTraveral<T>;
