"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graph = void 0;
/**
 * An undirected, weighted, simple graph with a fixed number of nodes (created on initialization)
 * implemented with an adjacency list. The graph can store anything. **Note**, internally uses === to
 * check for equality.
 */
class Graph {
    constructor(...args) {
        this.keyOf = (v) => this.keys.get(v);
        this.hasNode = (v) => this.keys.has(v);
        this.hasEdge = (u, v) => {
            if (!this.hasNode(u))
                return false;
            for (let i = 0; i < this.al[this.keyOf(u)].length; i++) {
                if (this.al[this.keyOf(u)][i][0] === v)
                    return true;
            }
            return false;
        };
        this.degree = (u) => (this.hasNode(u) ? this.al[this.keyOf(u)].length : 0);
        this.children = (u) => {
            const children = [];
            for (let i = 0; i < this.al[this.keyOf(u)].length; i++) {
                children.push(this.al[this.keyOf(u)][i][0]);
            }
            return children;
        };
        this.nodeCount = () => this.al.length;
        this.nodes = () => [...this.keys.keys()];
        this.edgeCount = () => {
            let count = 0;
            const keys = [...this.keys.keys()];
            for (let i = 0; i < keys.length; i++)
                count += this.degree(keys[i]);
            return Math.floor(count / 2);
        };
        this.al = [];
        this.keys = new Map();
        if (Array.isArray(args[0][0])) {
            const edges = args[0];
            for (let i = 0; i < edges.length; i++) {
                const [u, v] = edges[i];
                if (u === v)
                    continue;
                if (this.hasNode(u)) {
                    this.al[this.keyOf(u)].push([v, -1]);
                }
                else {
                    this.keys.set(u, this.al.length);
                    this.al.push([[v, -1]]);
                }
                if (this.hasNode(v)) {
                    this.al[this.keyOf(v)].push([u, -1]);
                }
                else {
                    this.keys.set(v, this.al.length);
                    this.al.push([[u, -1]]);
                }
            }
        }
        else {
            const nodes = args[0];
            for (let i = 0; i < nodes.length; i++) {
                if (this.hasNode(nodes[i]))
                    continue;
                this.keys.set(nodes[i], this.al.length);
                this.al.push([]);
            }
        }
    }
    addEdge(u, v, w = -1) {
        if (!this.hasNode(u) || !this.hasNode(v) || this.hasEdge(u, v))
            return;
        this.al[this.keyOf(u)].push([v, w]);
        this.al[this.keyOf(v)].push([u, w]);
    }
    deleteEdge(u, v) {
        if (!this.hasNode(u) || !this.hasNode(v) || !this.hasEdge(u, v))
            return;
        this.al[this.keyOf(u)].splice(this.al[this.keyOf(u)].findIndex(([o]) => o === v), 1);
        this.al[this.keyOf(v)].splice(this.al[this.keyOf(v)].findIndex(([o]) => o === u), 1);
    }
    getWeight(u, v) {
        if (!this.hasEdge(u, v))
            return -1;
        const li = this.al[this.keyOf(u)];
        for (let i = 0; i < li.length; i++) {
            if (li[i][0] === v)
                return li[i][1];
        }
        return -1;
    }
    setWeight(u, v, w) {
        if (!this.hasEdge(u, v))
            return;
        let li = this.al[this.keyOf(u)];
        li[li.findIndex(([o]) => o === v)][1] = w;
        li = this.al[this.keyOf(v)];
        li[li.findIndex(([o]) => o === u)][1] = w;
    }
}
exports.Graph = Graph;
exports.default = Graph;
