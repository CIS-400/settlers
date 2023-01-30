"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importStar(require("assert"));
const action_1 = __importStar(require("../src/game/action"));
const game_1 = __importStar(require("../src/game/game"));
const turn_fsm_1 = require("../src/game/turn_fsm");
describe('handle roll action', () => {
    const game = new game_1.default();
    // configure game
    game.turnState = turn_fsm_1.TurnState.Preroll;
    it('handleAction(<roll action>, 1) returns null, requester incorrect', () => {
        const e = game.handleAction(new action_1.default(action_1.ActionType.Roll, 1, { value: 3 }));
        assert_1.default.strictEqual(e, null);
        assert_1.default.strictEqual(game.turnState, turn_fsm_1.TurnState.Preroll);
    });
    it('handleAction(<roll action>, 0) returns a roll event', () => {
        const e = game.handleAction(new action_1.default(action_1.ActionType.Roll, 0, { value: 3 }));
        assert_1.default.notStrictEqual(e, null);
        assert_1.default.strictEqual(e instanceof action_1.default, true);
        assert_1.default.strictEqual(e.type, action_1.ActionType.Roll);
        const payload = e.payload;
        assert_1.default.strictEqual(payload.value <= 12, true);
        assert_1.default.strictEqual(payload.value >= 1, true);
        assert_1.default.strictEqual(game.turnState, turn_fsm_1.TurnState.Postroll);
    });
});
describe('roll & endturn actions', () => {
    const game = new game_1.default();
    // configure game
    game.turnState = turn_fsm_1.TurnState.Preroll;
    it('roll, endturn, roll, endturn', () => {
        game.handleAction(new action_1.default(action_1.ActionType.Roll, 0, { value: 3 }));
        assert_1.default.strictEqual(game.turnState, turn_fsm_1.TurnState.Postroll);
        game.handleAction(new action_1.default(action_1.ActionType.EndTurn, 0));
        assert_1.default.strictEqual(game.turnState, turn_fsm_1.TurnState.Preroll);
        assert_1.default.strictEqual(game.turn, 1);
        game.handleAction(new action_1.default(action_1.ActionType.Roll, 1, { value: 3 }));
        assert_1.default.strictEqual(game.turnState, turn_fsm_1.TurnState.Postroll);
        game.handleAction(new action_1.default(action_1.ActionType.EndTurn, 1));
        assert_1.default.strictEqual(game.turnState, turn_fsm_1.TurnState.Preroll);
        assert_1.default.strictEqual(game.turn, 2);
    });
});
describe('setup phases', () => {
    it('works', () => {
        const g = new game_1.default();
        const a = g;
        let act;
        // Forward setup.
        for (let i = 0; i < 4; i++) {
            (0, assert_1.strictEqual)(a.phase, game_1.GamePhase.SetupForward);
            (0, assert_1.strictEqual)(a.turn, i);
            (0, assert_1.strictEqual)(a.turnState, turn_fsm_1.TurnState.SetupSettlement);
            act = g.handleAction(new action_1.default(action_1.ActionType.BuildSettlement, i, { node: 2 * i }));
            (0, assert_1.notStrictEqual)(act, null);
            (0, assert_1.strictEqual)(a.phase, game_1.GamePhase.SetupForward);
            (0, assert_1.strictEqual)(a.turn, i);
            (0, assert_1.strictEqual)(a.turnState, turn_fsm_1.TurnState.SetupRoad);
            act = g.handleAction(new action_1.default(action_1.ActionType.BuildRoad, i, { node0: 2 * i, node1: 2 * i + 8 }));
            (0, assert_1.notStrictEqual)(act, null);
        }
        for (let i = 3; i >= 0; i--) {
            (0, assert_1.strictEqual)(a.phase, game_1.GamePhase.SetupBackward);
            (0, assert_1.strictEqual)(a.turn, i);
            (0, assert_1.strictEqual)(a.turnState, turn_fsm_1.TurnState.SetupSettlement);
            act = g.handleAction(new action_1.default(action_1.ActionType.BuildSettlement, i, { node: 7 + 2 * i }));
            (0, assert_1.notStrictEqual)(act, null);
            (0, assert_1.strictEqual)(a.phase, game_1.GamePhase.SetupBackward);
            (0, assert_1.strictEqual)(a.turn, i);
            (0, assert_1.strictEqual)(a.turnState, turn_fsm_1.TurnState.SetupRoad);
            act = g.handleAction(new action_1.default(action_1.ActionType.BuildRoad, i, { node0: 7 + 2 * i, node1: 17 + 2 * i }));
            (0, assert_1.notStrictEqual)(act, null);
        }
        (0, assert_1.strictEqual)(a.phase, game_1.GamePhase.Playing);
    });
});
describe('setup space 20', () => {
    it('huh', () => {
        const g = new game_1.default();
        const a = g.handleAction(new action_1.default(action_1.ActionType.BuildSettlement, 0, { node: 19 }));
        (0, assert_1.notStrictEqual)(a, null);
    });
});
