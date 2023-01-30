"use strict";
/**
 * The Finite State Machine for transitioning between turn states based on actions.
 * @module
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidTransition = exports.TurnState = void 0;
const action_1 = require("./action");
var TurnState;
(function (TurnState) {
    TurnState["SetupSettlement"] = "Setup Settlement";
    TurnState["SetupRoad"] = "Setup Road";
    TurnState["Preroll"] = "Pre-roll";
    TurnState["Postroll"] = "Post-roll";
    TurnState["MovingRobber"] = "Moving Robber";
    TurnState["Robbing"] = "Robbing";
    TurnState["SelectingMonopolyResource"] = "Selecting Monopoly Resource";
    TurnState["SelectingYearOfPlentyResources"] = "Selecting Year of Plenty Resource";
    TurnState["Discarding"] = "Discarding";
})(TurnState = exports.TurnState || (exports.TurnState = {}));
/**
 * Determines if an action may even be considered given the current state.
 * i.e. you can't do a roll action if turn state is `TurnState.Postroll`
 * @param state The current turn state
 * @param action The desired action
 * @returns boolean indicating whether given this turn state, this action is even allowed.
 */
const isValidTransition = (state, action) => {
    const validActions = (() => {
        switch (state) {
            case TurnState.SetupSettlement:
                return [action_1.ActionType.BuildSettlement];
            case TurnState.SetupRoad:
                return [action_1.ActionType.BuildRoad];
            case TurnState.Preroll:
                return [
                    action_1.ActionType.PlayMonopoly,
                    action_1.ActionType.PlayRobber,
                    action_1.ActionType.PlayYearOfPlenty,
                    action_1.ActionType.PlayRoadBuilder,
                    action_1.ActionType.Roll,
                    action_1.ActionType.BuildRoad, // iff you have free roads.
                ];
            case TurnState.MovingRobber:
                return [action_1.ActionType.MoveRobber];
            case TurnState.Robbing:
                return [action_1.ActionType.Rob];
            case TurnState.SelectingMonopolyResource:
                return [action_1.ActionType.SelectMonopolyResource];
            case TurnState.SelectingYearOfPlentyResources:
                return [action_1.ActionType.SelectYearOfPlentyResources];
            case TurnState.Discarding:
                return [action_1.ActionType.Discard];
            default:
                // Post roll.
                return [
                    // Trade.
                    action_1.ActionType.MakeTradeOffer,
                    action_1.ActionType.DecideOnTradeOffer,
                    action_1.ActionType.Exchange,
                    // Play dev cards.
                    action_1.ActionType.PlayMonopoly,
                    action_1.ActionType.PlayRobber,
                    action_1.ActionType.PlayYearOfPlenty,
                    action_1.ActionType.PlayRoadBuilder,
                    action_1.ActionType.EndTurn,
                    action_1.ActionType.DrawDevCard,
                    // Build things.
                    action_1.ActionType.BuildCity,
                    action_1.ActionType.BuildRoad,
                    action_1.ActionType.BuildSettlement,
                ];
        }
    })();
    return validActions.includes(action.type);
};
exports.isValidTransition = isValidTransition;
exports.default = exports.isValidTransition;
