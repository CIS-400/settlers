"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const action_1 = require("../src/game/action");
describe('roll action', () => {
    it('should create a roll action', () => {
        assert_1.default.strictEqual(new action_1.Action(action_1.ActionType.Roll).type, action_1.ActionType.Roll);
    });
});
