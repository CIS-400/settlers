"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const tile_1 = __importDefault(require("../../src/game/board/tile"));
const resource_1 = __importDefault(require("../../src/game/resource/resource"));
describe('tile lifecycle & isAdjacentTo()', () => {
    it('should have valid state', () => {
        const t = new tile_1.default(resource_1.default.Ore, [0, 1, 2]);
        const t2 = new tile_1.default(resource_1.default.Lumber, [2, 3, 4]);
        const t3 = new tile_1.default(resource_1.default.Ore, [5, 7]);
        (0, assert_1.strictEqual)(t.resource, resource_1.default.Ore);
        (0, assert_1.strictEqual)(t.isAdjacentTo(t2), true);
        (0, assert_1.strictEqual)(t2.isAdjacentTo(t), true);
        (0, assert_1.strictEqual)(t2.isAdjacentTo(t3), false);
        (0, assert_1.strictEqual)(t3.isAdjacentTo(t2), false);
        (0, assert_1.strictEqual)(t3.isAdjacentTo(t), false);
    });
});
