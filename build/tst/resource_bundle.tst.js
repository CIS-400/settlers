"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const resource_1 = __importDefault(require("../src/game/resource/resource"));
const resource_bundle_1 = __importDefault(require("../src/game/resource/resource_bundle"));
describe('new ResourceBundle()', () => {
    it('should create an empty bundle', () => {
        const b = new resource_bundle_1.default();
        assert_1.default.strictEqual(b.get(resource_1.default.Grain), 0);
    });
});
describe('new ResourceBundle(3)', () => {
    it('should create a bundle with 3 resources per', () => {
        const b = new resource_bundle_1.default(3);
        assert_1.default.strictEqual(b.get(resource_1.default.Lumber), 3);
    });
});
describe('add()', () => {
    it('should create have 1 + 2 resources', () => {
        const b = new resource_bundle_1.default(2);
        const b2 = new resource_bundle_1.default(1);
        b.add(b2);
        assert_1.default.strictEqual(b.get(resource_1.default.Lumber), 3);
        assert_1.default.strictEqual(b.get(resource_1.default.Brick), 3);
        assert_1.default.strictEqual(b.get(resource_1.default.Wool), 3);
        assert_1.default.strictEqual(b.get(resource_1.default.Grain), 3);
    });
});
describe('isEmpty()', () => {
    it('returns true for empty bundle', () => {
        assert_1.default.strictEqual(new resource_bundle_1.default().isEmpty(), true);
    });
});
describe('subtract()', () => {
    it('should create an empty bundle', () => {
        const b = new resource_bundle_1.default(2);
        const b2 = new resource_bundle_1.default(2);
        b.subtract(b2);
        assert_1.default.strictEqual(b.get(resource_1.default.Lumber), 0);
        assert_1.default.strictEqual(b2.get(resource_1.default.Grain), 2);
        assert_1.default.strictEqual(b.isEmpty(), true);
    });
});
describe('trade()', () => {
    it('should transfer resources', () => {
        const offerer = new resource_bundle_1.default(2);
        const offeree = new resource_bundle_1.default(1);
        const offer = new resource_bundle_1.default([0, 2, 0, 0, 0]);
        resource_bundle_1.default.trade(new resource_bundle_1.default(), offeree, offer, offerer);
        assert_1.default.strictEqual(offeree.get(resource_1.default.Lumber), 3);
        assert_1.default.strictEqual(offeree.get(resource_1.default.Grain), 1);
        assert_1.default.strictEqual(offerer.get(resource_1.default.Lumber), 0);
        assert_1.default.strictEqual(offerer.get(resource_1.default.Grain), 2);
    });
});
describe('removeAll()', () => {
    it('should have no grain', () => {
        const b = new resource_bundle_1.default(4);
        const amnt = b.removeAll(resource_1.default.Grain);
        assert_1.default.strictEqual(amnt, 4);
        assert_1.default.strictEqual(b.get(resource_1.default.Grain), 0);
    });
});
describe('removeOneAtRandom()', () => {
    it('should always remove lumber', () => {
        const b = new resource_bundle_1.default([0, 2, 0, 0, 0]);
        assert_1.default.strictEqual(b.removeOneAtRandom(), resource_1.default.Lumber);
        assert_1.default.strictEqual(b.removeOneAtRandom(), resource_1.default.Lumber);
        assert_1.default.strictEqual(b.isEmpty(), true);
    });
    it('should be empty after all removes', () => {
        const b = new resource_bundle_1.default([0, 1, 0, 1, 1]);
        b.removeOneAtRandom();
        assert_1.default.strictEqual(b.size(), 2);
        b.removeOneAtRandom();
        assert_1.default.strictEqual(b.size(), 1);
        b.removeOneAtRandom();
        assert_1.default.strictEqual(b.isEmpty(), true);
    });
});
describe('has()', () => {
    it('can buy 2 dev cards', () => {
        const b = new resource_bundle_1.default([0, 2, 2, 3, 2]);
        assert_1.default.strictEqual(b.has(resource_bundle_1.default.devCardCost), true);
        b.subtract(resource_bundle_1.default.devCardCost);
        assert_1.default.strictEqual(b.has(resource_bundle_1.default.devCardCost), true);
        b.subtract(resource_bundle_1.default.devCardCost);
        assert_1.default.strictEqual(b.has(resource_bundle_1.default.devCardCost), false);
    });
});
