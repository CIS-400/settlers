"use strict";
/**
 * Declares and defines all possible actions.
 * @module
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = exports.actionTypeStr = exports.ActionType = void 0;
/**
 * All possible types of actions.
 */
var ActionType;
(function (ActionType) {
    ActionType[ActionType["Roll"] = 0] = "Roll";
    ActionType[ActionType["PlayRobber"] = 1] = "PlayRobber";
    ActionType[ActionType["MoveRobber"] = 2] = "MoveRobber";
    ActionType[ActionType["Rob"] = 3] = "Rob";
    ActionType[ActionType["PlayMonopoly"] = 4] = "PlayMonopoly";
    ActionType[ActionType["SelectMonopolyResource"] = 5] = "SelectMonopolyResource";
    ActionType[ActionType["PlayYearOfPlenty"] = 6] = "PlayYearOfPlenty";
    ActionType[ActionType["SelectYearOfPlentyResources"] = 7] = "SelectYearOfPlentyResources";
    ActionType[ActionType["PlayRoadBuilder"] = 8] = "PlayRoadBuilder";
    ActionType[ActionType["BuildSettlement"] = 9] = "BuildSettlement";
    ActionType[ActionType["BuildCity"] = 10] = "BuildCity";
    ActionType[ActionType["BuildRoad"] = 11] = "BuildRoad";
    ActionType[ActionType["Discard"] = 12] = "Discard";
    ActionType[ActionType["MakeTradeOffer"] = 13] = "MakeTradeOffer";
    ActionType[ActionType["DecideOnTradeOffer"] = 14] = "DecideOnTradeOffer";
    ActionType[ActionType["DrawDevCard"] = 15] = "DrawDevCard";
    ActionType[ActionType["Exchange"] = 16] = "Exchange";
    ActionType[ActionType["EndTurn"] = 17] = "EndTurn";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
const actionTypeStr = (a) => {
    switch (a) {
        case ActionType.Roll:
            return 'Roll';
        case ActionType.PlayRobber:
            return 'Play Robber';
        case ActionType.MoveRobber:
            return 'Move Robber';
        case ActionType.Rob:
            return 'Rob';
        case ActionType.PlayMonopoly:
            return 'Play Monopoly';
        case ActionType.SelectMonopolyResource:
            return 'Select Monopoly Resource';
        case ActionType.PlayYearOfPlenty:
            return 'Play YOP';
        case ActionType.SelectYearOfPlentyResources:
            return 'Select YOP Resources';
        case ActionType.PlayRoadBuilder:
            return 'Play Road Builder';
        case ActionType.BuildSettlement:
            return 'Build Settlement';
        case ActionType.BuildCity:
            return 'Build City';
        case ActionType.BuildRoad:
            return 'Build Road';
        case ActionType.Discard:
            return 'Discard';
        case ActionType.MakeTradeOffer:
            return 'Make Trade Offer';
        case ActionType.DecideOnTradeOffer:
            return 'Decide on Trade Offer';
        case ActionType.DrawDevCard:
            return 'Draw Dev Card';
        case ActionType.Exchange:
            return 'Exchange';
        default:
            return 'End Turn';
    }
};
exports.actionTypeStr = actionTypeStr;
/**
 * An action is a request to change the game's state in some way
 * such as by rolling the die, accepting a trade offer, playing a development card, etc.
 *
 * All actions are **verifiable**, meaning they can (and always are) checked to
 * be valid actions given the current game state. i.e. you can't roll twice on a turn.
 *
 * Actions link between turn states in the turn state finite state machine.
 *
 * A verified action can be applied to game state to update it in a safe and predictable
 * manner.
 */
class Action {
    constructor(type, player = 0, payload = {}) {
        this.serialized = () => JSON.stringify(this);
        this.type = type;
        this.player = player;
        this.payload = payload;
    }
}
exports.Action = Action;
Action.deserialize = (serializedObj) => {
    const { type, payload, player } = JSON.parse(serializedObj);
    return new Action(type, player, payload);
};
exports.default = Action;
