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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require('readline');
const action_1 = __importStar(require("./game/action"));
const game_1 = __importDefault(require("./game/game"));
const resource_bundle_1 = __importDefault(require("./game/resource/resource_bundle"));
const game = new game_1.default();
const a = game;
// a.phase = GamePhase.Playing
// a.turnState = TurnState.Preroll
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const parseAction = (line) => {
    const args = line.split(' ');
    const type = parseInt(args[0]);
    switch (type) {
        case action_1.ActionType.Exchange:
            return new action_1.default(type, a.turn, { offer: args[1], request: args[2] });
        case action_1.ActionType.MakeTradeOffer:
            return new action_1.default(type, a.turn, {
                offer: new resource_bundle_1.default(args.slice(1, 6).map((elt) => parseInt(elt))),
                request: new resource_bundle_1.default(args.slice(6).map((elt) => parseInt(elt))),
            });
        case action_1.ActionType.DecideOnTradeOffer:
            return new action_1.default(type, a.turn, {
                status: parseInt(args[1]),
                id: parseInt(args[2]),
                withPlayer: args[3] ? parseInt(args[3]) : undefined,
            });
        case action_1.ActionType.Discard:
            return new action_1.default(type, a.turn, {
                bundle: new resource_bundle_1.default(args.slice(1, 6).map(parseInt)),
            });
        case action_1.ActionType.MoveRobber:
            return new action_1.default(type, a.turn, {
                to: parseInt(args[1]),
            });
        case action_1.ActionType.Rob:
            return new action_1.default(type, a.turn, {
                victim: parseInt(args[1]),
            });
        case action_1.ActionType.SelectMonopolyResource:
            return new action_1.default(type, a.turn, { resource: parseInt(args[1]) });
        case action_1.ActionType.SelectYearOfPlentyResources:
            return new action_1.default(type, a.turn, { resources: [parseInt(args[1]), parseInt(args[2])] });
        case action_1.ActionType.BuildCity:
        case action_1.ActionType.BuildSettlement:
            return new action_1.default(type, a.turn, { node: parseInt(args[1]) });
        case action_1.ActionType.BuildRoad:
            return new action_1.default(type, a.turn, { node0: parseInt(args[1]), node1: parseInt(args[2]) });
        default:
            return new action_1.default(type, a.turn);
    }
};
let opts = '';
for (let i = 0; i < 18; i++)
    opts += `${i}: ${(0, action_1.actionTypeStr)(i)}, `;
let prompt = '$ ';
rl.on('line', (line) => {
    const action = game.handleAction(parseAction(line));
    if (action === null) {
        console.log('action failed.');
        process.stdout.write(prompt);
    }
    else {
        console.clear();
        console.log(game.toLog());
        console.log(opts);
        process.stdout.write(prompt);
    }
});
console.clear();
console.log(game.toLog());
console.log(opts);
process.stdout.write(prompt);
