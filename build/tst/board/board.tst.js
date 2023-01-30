"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const chai_1 = __importDefault(require("chai"));
const board_1 = __importDefault(require("../../src/game/board/board"));
const constants_1 = require("../../src/game/constants");
const resource_1 = __importDefault(require("../../src/game/resource/resource"));
describe('board', () => {
    it('setup is valid.', () => {
        const b = new board_1.default();
        chai_1.default.expect(b.tiles[0].nodes).to.have.members([0, 1, 2, 8, 9, 10]);
        chai_1.default.expect(b.tiles[2].nodes).to.have.members([4, 5, 6, 12, 13, 14]);
        chai_1.default.expect(b.tiles[4].nodes).to.have.members([9, 10, 11, 19, 20, 21]);
        chai_1.default.expect(b.tiles[9].nodes).to.have.members([20, 21, 22, 31, 32, 33]);
        chai_1.default.expect(b.tiles[18].nodes).to.have.members([43, 44, 45, 51, 52, 53]);
        //Robber is on desert and desert has 7.
        (0, assert_1.notStrictEqual)(b.robber, -1);
        const rt = b.tiles[b.robber];
        (0, assert_1.strictEqual)(rt.getNumber(), 7);
        (0, assert_1.strictEqual)(rt.resource, resource_1.default.None);
        // Amounts of each tile resource are correct
        chai_1.default
            .expect(b.tiles.filter((tile) => tile.resource === resource_1.default.Ore).length)
            .eqls(constants_1.NUM_EACH_RESOURCE_TILE[resource_1.default.Ore]);
        chai_1.default
            .expect(b.tiles.filter((tile) => tile.resource === resource_1.default.Brick).length)
            .eqls(constants_1.NUM_EACH_RESOURCE_TILE[resource_1.default.Brick]);
        chai_1.default
            .expect(b.tiles.filter((tile) => tile.resource === resource_1.default.Lumber).length)
            .eqls(constants_1.NUM_EACH_RESOURCE_TILE[resource_1.default.Lumber]);
        chai_1.default
            .expect(b.tiles.filter((tile) => tile.resource === resource_1.default.Grain).length)
            .eqls(constants_1.NUM_EACH_RESOURCE_TILE[resource_1.default.Grain]);
        chai_1.default
            .expect(b.tiles.filter((tile) => tile.resource === resource_1.default.Wool).length)
            .eqls(constants_1.NUM_EACH_RESOURCE_TILE[resource_1.default.Wool]);
        chai_1.default.expect(b.tiles.filter((tile) => tile.resource === resource_1.default.None).length).eqls(1);
        // Amounts of each number token are correct.
        const temp = [1, 2, 2, 2, 2];
        const tokens = [...temp, 1, ...temp.reverse()];
        for (let i = 0; i < b.tiles.length; i++) {
            const num = b.tiles[i].getNumber();
            (0, assert_1.notStrictEqual)(num, -1);
            tokens[num - 2]--;
        }
        (0, assert_1.strictEqual)(tokens.find((elt) => elt !== 0), undefined);
    });
});
describe('board longestRoad one cc', () => {
    it('works for cases 0, 1', () => {
        const b = new board_1.default();
        (0, assert_1.strictEqual)(b.getRoad(0, 1), -1);
        // Case 1
        b.buildRoad(0, 1, 0);
        b.buildRoad(1, 2, 0);
        (0, assert_1.strictEqual)(b.getLongestRoad(0), 2);
        b.buildRoad(2, 10, 0);
        (0, assert_1.strictEqual)(b.getLongestRoad(0), 3);
        // Case 0
        b.buildRoad(10, 9, 0);
        (0, assert_1.strictEqual)(b.getRoad(10, 9), 0);
        b.buildRoad(9, 8, 0);
        (0, assert_1.strictEqual)(b.getRoad(8, 9), 0);
        b.buildRoad(8, 0, 0);
        (0, assert_1.strictEqual)(b.getRoad(8, 0), 0);
        (0, assert_1.strictEqual)(b.getLongestRoad(0), 6);
    });
    it('works for case 2a', () => {
        const b = new board_1.default();
        b.buildRoad(0, 1, 0);
        b.buildRoad(1, 2, 0);
        b.buildRoad(2, 10, 0);
        b.buildRoad(10, 11, 0);
        b.buildRoad(11, 21, 0);
        (0, assert_1.strictEqual)(b.getLongestRoad(0), 5);
    });
    it('works for case 2b simple', () => {
        const b = new board_1.default();
        b.buildRoad(0, 1, 0);
        b.buildRoad(1, 2, 0);
        b.buildRoad(2, 10, 0);
        b.buildRoad(10, 9, 0);
        b.buildRoad(9, 8, 0);
        b.buildRoad(8, 0, 0);
        b.buildRoad(7, 8, 0);
        b.buildRoad(17, 7, 0);
        (0, assert_1.strictEqual)(b.getLongestRoad(0), 8);
    });
    it('works for case 2b complex', () => {
        const b = new board_1.default();
        for (let i = 0; i < 4; i++) {
            b.buildRoad(i, i + 1, 0);
            b.buildRoad(i + 8, i + 9, 0);
        }
        b.buildRoad(0, 8, 0);
        b.buildRoad(2, 10, 0);
        b.buildRoad(4, 12, 0);
        (0, assert_1.strictEqual)(b.getLongestRoad(0), 11);
        b.buildRoad(12, 13, 0);
        b.buildRoad(13, 14, 0);
        (0, assert_1.strictEqual)(b.getLongestRoad(0), 12);
    });
});
describe('board longestRoad multiple cc', () => {
    it('works for cases 0, 1', () => {
        const b = new board_1.default();
        (0, assert_1.strictEqual)(b.getRoad(0, 1), -1);
        // Case 1
        b.buildRoad(0, 1, 0);
        b.buildRoad(1, 2, 0);
        // build an arbitrary random road somewhere else
        b.buildRoad(27, 28, 0);
        (0, assert_1.strictEqual)(b.getRoad(27, 28), 0);
        (0, assert_1.strictEqual)(b.getLongestRoad(0), 2);
        b.buildRoad(2, 10, 0);
        (0, assert_1.strictEqual)(b.getLongestRoad(0), 3);
        // Case 0
        b.buildRoad(10, 9, 0);
        b.buildRoad(9, 8, 0);
        b.buildRoad(8, 0, 0);
        (0, assert_1.strictEqual)(b.getLongestRoad(0), 6);
    });
});
describe('road interrupted by a settlement', () => {
    it('splits the road', () => {
        const b = new board_1.default();
        b.buildRoad(0, 1, 0);
        b.buildRoad(1, 2, 0);
        (0, assert_1.strictEqual)(b.getLongestRoad(0), 2);
        b.nodes[1].buildSettlement(1);
        (0, assert_1.strictEqual)(b.getLongestRoad(0), 1);
        (0, assert_1.strictEqual)(b.getLongestRoad(1), 0);
    });
});
// describe('board log', () => {
//   it('looks nice?', () => {
//     const b = new Board()
//     console.log(b.toLog())
//   })
// })
