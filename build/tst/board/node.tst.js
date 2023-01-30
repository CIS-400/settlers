"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const node_1 = __importDefault(require("../../src/game/board/node"));
const port_1 = __importDefault(require("../../src/game/board/port"));
const resource_1 = __importDefault(require("../../src/game/resource/resource"));
describe('node lifecycle', () => {
    it('should have valid state', () => {
        const n = new node_1.default();
        (0, assert_1.strictEqual)(n.isEmpty(), true);
        (0, assert_1.strictEqual)(n.getPlayer(), -1);
        (0, assert_1.strictEqual)(n.hasCity(), false);
        (0, assert_1.strictEqual)(n.getPort(), null);
        n.buildCity();
        (0, assert_1.strictEqual)(n.isEmpty(), true);
        (0, assert_1.strictEqual)(n.getPlayer(), -1);
        (0, assert_1.strictEqual)(n.hasCity(), false);
        (0, assert_1.strictEqual)(n.getPort(), null);
        n.buildSettlement(0);
        (0, assert_1.strictEqual)(n.isEmpty(), false);
        (0, assert_1.strictEqual)(n.getPlayer(), 0);
        (0, assert_1.strictEqual)(n.hasCity(), false);
        (0, assert_1.strictEqual)(n.getPort(), null);
        n.buildCity();
        (0, assert_1.strictEqual)(n.isEmpty(), false);
        (0, assert_1.strictEqual)(n.getPlayer(), 0);
        (0, assert_1.strictEqual)(n.hasCity(), true);
        (0, assert_1.strictEqual)(n.getPort(), null);
        n.setPort(new port_1.default([resource_1.default.Ore], 2));
        (0, assert_1.strictEqual)(n.getPort().rate, 2);
        (0, assert_1.strictEqual)(n.getPort().resources[0], resource_1.default.Ore);
    });
});
