/**
 * The Finite State Machine for transitioning between turn states based on actions.
 * @module
 */
import { Action } from './action';
export declare enum TurnState {
    SetupSettlement = "Setup Settlement",
    SetupRoad = "Setup Road",
    Preroll = "Pre-roll",
    Postroll = "Post-roll",
    MovingRobber = "Moving Robber",
    Robbing = "Robbing",
    SelectingMonopolyResource = "Selecting Monopoly Resource",
    SelectingYearOfPlentyResources = "Selecting Year of Plenty Resource",
    Discarding = "Discarding"
}
/**
 * Determines if an action may even be considered given the current state.
 * i.e. you can't do a roll action if turn state is `TurnState.Postroll`
 * @param state The current turn state
 * @param action The desired action
 * @returns boolean indicating whether given this turn state, this action is even allowed.
 */
export declare const isValidTransition: (state: TurnState, action: Action) => boolean;
export default isValidTransition;
