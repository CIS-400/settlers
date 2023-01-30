"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const dev_card_1 = __importDefault(require("../src/game/dev_card/dev_card"));
const dev_card_bundle_1 = __importDefault(require("../src/game/dev_card/dev_card_bundle"));
describe('new ResourceBundle()', () => {
    it('should create an empty bundle', () => {
        const b = new dev_card_bundle_1.default();
        assert_1.default.strictEqual(b.isEmpty(), true);
    });
});
describe('remove()', () => {
    it('dev cards should be empty', () => {
        const b = new dev_card_bundle_1.default([0, 1, 0, 0, 0]);
        assert_1.default.strictEqual(b.isEmpty(), false);
        b.remove(dev_card_1.default.VictoryPoint);
        assert_1.default.strictEqual(b.isEmpty(), true);
    });
});
describe('add()', () => {
    it('adds a knight', () => {
        const b = new dev_card_bundle_1.default();
        assert_1.default.strictEqual(b.isEmpty(), true);
        b.add(dev_card_1.default.Knight);
        assert_1.default.strictEqual(b.isEmpty(), false);
        assert_1.default.strictEqual(b.has(dev_card_1.default.Knight), true);
    });
});
describe('removeOneAtRandom()', () => {
    it('removes a monopoly and vp', () => {
        const b = new dev_card_bundle_1.default([0, 1, 0, 1, 0]);
        assert_1.default.strictEqual(b.isEmpty(), false);
        const elt = b.pickOneAtRandom();
        b.remove(elt);
        const elt2 = b.pickOneAtRandom();
        b.remove(elt2);
        const things = [elt, elt2];
        assert_1.default.strictEqual(things.includes(dev_card_1.default.VictoryPoint), true);
        assert_1.default.strictEqual(things.includes(dev_card_1.default.Monopoly), true);
    });
});
