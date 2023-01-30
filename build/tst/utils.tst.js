"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const chai_1 = __importDefault(require("chai"));
const graph_1 = __importDefault(require("../src/game/board/graph"));
const utils_1 = require("../src/game/utils");
describe('graph basic tests', () => {
    it('works :)', () => {
        const g = new graph_1.default([
            [0, 1],
            [1, 2],
        ]);
        (0, assert_1.strictEqual)(g.nodeCount(), 3);
        (0, assert_1.strictEqual)(g.hasEdge(0, 1), true);
        (0, assert_1.strictEqual)(g.hasEdge(1, 2), true);
        (0, assert_1.strictEqual)(g.hasEdge(0, 2), false);
        (0, assert_1.strictEqual)(g.degree(1), 2);
        (0, assert_1.strictEqual)(g.degree(0), 1);
        chai_1.default.expect(g.children(1)).to.have.members([0, 2]);
        chai_1.default.expect(g.children(0)).to.have.members([1]);
        chai_1.default.expect(g.children(2)).to.have.members([1]);
        g.deleteEdge(0, 1);
        (0, assert_1.strictEqual)(g.hasEdge(0, 1), false);
    });
});
describe('breadthFirstSearch()', () => {
    it('works for basic tests :)', () => {
        const g = new graph_1.default([
            [0, 1],
            [1, 2],
            [2, 0],
        ]);
        const b = (0, utils_1.breadthFirstSearch)(g, 0);
        chai_1.default.expect([...b.visited]).to.have.members([0, 1, 2]);
        (0, assert_1.strictEqual)(b.depth, 1);
    });
    it('works for more advanced tests', () => {
        const g = new graph_1.default([
            [0, 1],
            [1, 2],
            [2, 0],
            [2, 3],
            [3, 4],
            [5, 6],
        ]);
        const b = (0, utils_1.breadthFirstSearch)(g, 0);
        chai_1.default.expect([...b.visited]).to.have.members([0, 1, 2, 3, 4]);
        (0, assert_1.strictEqual)(b.depth, 3);
    });
});
describe('connectedComponents()', () => {
    it('works for 1 cc', () => {
        const g = new graph_1.default([
            [0, 1],
            [1, 2],
        ]);
        const ccs = (0, utils_1.connectedComponents)(g);
        (0, assert_1.strictEqual)(ccs.length, 1);
        (0, assert_1.strictEqual)(ccs[0].hasEdge(0, 1), true);
        (0, assert_1.strictEqual)(ccs[0].hasEdge(2, 1), true);
    });
    it('works for multiple cc', () => {
        const g = new graph_1.default([
            [0, 1],
            [1, 2],
            [4, 5],
            [6, 7],
        ]);
        const ccs = (0, utils_1.connectedComponents)(g);
        (0, assert_1.strictEqual)(ccs.length, 3);
        (0, assert_1.strictEqual)(ccs[0].hasEdge(0, 1), true);
        (0, assert_1.strictEqual)(ccs[0].hasEdge(1, 2), true);
    });
});
describe('maxTrail()', () => {
    it('works :)', () => {
        const g = new graph_1.default([
            [0, 1],
            [1, 2],
            [2, 0],
        ]);
        (0, assert_1.strictEqual)((0, utils_1.maxTrail)(g, 0), 3);
        const hex = new graph_1.default([
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 5],
            [5, 0],
            [5, 6],
            [6, 7],
        ]);
        (0, assert_1.strictEqual)((0, utils_1.maxTrail)(hex, 7), 8);
    });
    it('works for double hex problem', () => {
        const g = new graph_1.default([
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 5],
            [5, 0],
            [5, 6],
            [6, 7],
            [7, 8],
            [8, 9],
            [9, 4],
            [7, 10],
            [10, 11],
        ]);
        (0, assert_1.strictEqual)((0, utils_1.maxTrail)(g, 11), 12);
    });
});
