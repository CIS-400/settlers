"use strict";
/**
 * Defines a set of utility functions & classes for logic for math, strings, etc.
 * @module
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.breadthFirstSearch = exports.connectedComponents = exports.maxTrail = exports.maxTrailRec = exports.uniformRandom = exports.rollDie = exports.weightedRandom = void 0;
const graph_1 = __importDefault(require("./board/graph"));
/**
 * Returns a index from a weighted array.
 * @param weights An array of weights
 * @return The index to remove or -1 if no such index if weights are 0 or
 * array is empty.
 */
const weightedRandom = (weights) => {
    const sum = weights.reduce((acc, curr) => acc + curr);
    let value = Math.random() * sum;
    for (let i = 0; i < weights.length; i++) {
        value -= weights[i];
        if (value <= 0)
            return i;
    }
    return -1;
};
exports.weightedRandom = weightedRandom;
/**
 * Roll a die.
 * @returns A uniform int on [1, 6]
 */
const rollDie = () => (0, exports.uniformRandom)(1, 6);
exports.rollDie = rollDie;
/**
 * @returns A uniform int on [lo, hi]
 */
const uniformRandom = (lo, hi) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
exports.uniformRandom = uniformRandom;
/**
 * A recursive helper function to find the max trail.
 * @param v The current node.
 * @param g The graph.
 * @param seen A list of edges already visited.
 * @returns The length of the max trail.
 */
function maxTrailRec(v, g, seen) {
    const choices = g.children(v).filter((other) => !seen.hasEdge(v, other));
    if (choices.length === 0)
        return 0;
    let u, ret;
    u = choices[0];
    seen.addEdge(u, v);
    ret = 1 + maxTrailRec(u, g, seen);
    seen.deleteEdge(u, v);
    if (choices.length === 2) {
        u = choices[1];
        seen.addEdge(u, v);
        ret = Math.max(ret, 1 + maxTrailRec(u, g, seen));
        seen.deleteEdge(u, v);
    }
    return ret;
}
exports.maxTrailRec = maxTrailRec;
/**
 * maxTrail explores every possible trail that starts at node `src` and
 * return the max length of all trials.
 * @param g The graph.
 * @param src The starting node.
 */
const maxTrail = (g, src) => {
    const seen = new graph_1.default(g.nodes());
    return maxTrailRec(src, g, seen);
};
exports.maxTrail = maxTrail;
/**
 * Get a list of graphs that are the connected components of graph `g`.
 * @param g The graph.
 * @returns A list of ccs.
 */
const connectedComponents = (g) => {
    let remaining = g.nodes();
    const ccs = [];
    while (remaining.length > 0) {
        const src = remaining[0];
        const { visited } = (0, exports.breadthFirstSearch)(g, src);
        const li = [...visited];
        const cc = new graph_1.default(li);
        for (let i = 0; i < li.length; i++) {
            for (let j = i + 1; j < li.length; j++) {
                if (g.hasEdge(li[i], li[j]))
                    cc.addEdge(li[i], li[j]);
            }
        }
        ccs.push(cc);
        remaining = remaining.filter((elt) => !visited.has(elt));
    }
    return ccs;
};
exports.connectedComponents = connectedComponents;
/**
 * Run BFS on a graph from a source.
 * @param g The graph.
 * @param src The source elt.
 * @returns A BFS traversal object that includes a list of visited graph elts
 * and the max depth of the BFS tree.
 */
const breadthFirstSearch = (g, src) => {
    const queue = [src];
    const visited = new Set([src]);
    const depths = new Map();
    depths.set(src, 0);
    while (queue.length > 0) {
        const curr = queue.pop();
        const children = g.children(curr);
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (visited.has(child))
                continue;
            queue.unshift(child);
            visited.add(child);
            depths.set(child, depths.get(curr) + 1);
        }
    }
    return {
        visited,
        depth: Math.max(...depths.values()),
    };
};
exports.breadthFirstSearch = breadthFirstSearch;
