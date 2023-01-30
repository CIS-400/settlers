/**
 * Declares and defines all possible actions.
 * @module
 */
import DevCard from './dev_card/dev_card';
import Resource from './resource/resource';
import ResourceBundle from './resource/resource_bundle';
import { TradeStatus } from './trade_offer';
/**
 * All possible types of actions.
 */
export declare enum ActionType {
    Roll = 0,
    PlayRobber = 1,
    MoveRobber = 2,
    Rob = 3,
    PlayMonopoly = 4,
    SelectMonopolyResource = 5,
    PlayYearOfPlenty = 6,
    SelectYearOfPlentyResources = 7,
    PlayRoadBuilder = 8,
    BuildSettlement = 9,
    BuildCity = 10,
    BuildRoad = 11,
    Discard = 12,
    MakeTradeOffer = 13,
    DecideOnTradeOffer = 14,
    DrawDevCard = 15,
    Exchange = 16,
    EndTurn = 17
}
export declare const actionTypeStr: (a: ActionType) => "Roll" | "Play Robber" | "Move Robber" | "Rob" | "Play Monopoly" | "Select Monopoly Resource" | "Play YOP" | "Select YOP Resources" | "Play Road Builder" | "Build Settlement" | "Build City" | "Build Road" | "Discard" | "Make Trade Offer" | "Decide on Trade Offer" | "Draw Dev Card" | "Exchange" | "End Turn";
export interface ActionPayload {
}
export interface ExchangePayload extends ActionPayload {
    offer: Resource;
    request: Resource;
}
export interface MakeTradeOfferPayload extends ActionPayload {
    /** What is the actual offer lol */
    offer: ResourceBundle;
    request: ResourceBundle;
}
export interface TradeOfferDecisionPayload extends ActionPayload {
    /** The decision. */
    status: TradeStatus;
    /** The id of the trade. */
    id: number;
    /** The player we are agreeing to do the trade with. Only needed by host. */
    withPlayer?: number;
}
export interface DiscardPayload extends ActionPayload {
    /** The bundle we'll be discarding */
    bundle: ResourceBundle;
}
export interface DrawDevCardPayload extends ActionPayload {
    /** The card we draw */
    card: DevCard;
}
export interface RollPayload extends ActionPayload {
    /** the value of the dice sum. */
    value: number;
}
export interface MoveRobberPayload extends ActionPayload {
    /** The tile number we want to move the robber to. */
    to: number;
}
export interface RobPayload extends ActionPayload {
    /** The number of the player we want to rob. */
    victim: number;
}
export interface SelectMonopolyResourcePayload extends ActionPayload {
    /** The resource we want to monopoly. */
    resource: Resource;
}
export interface SelectYearOfPlentyResourcesPayload extends ActionPayload {
    /** The resources we want to get. */
    resources: [Resource, Resource];
}
export interface BuildSettlementPayload extends ActionPayload {
    /** The node number we want to build a settlement on. */
    node: number;
}
export interface BuildCityPayload extends ActionPayload {
    /** The node number we want to build a city on. */
    node: number;
}
export interface BuildRoadPayload extends ActionPayload {
    /** The edge number we want to build a settlement on. */
    node0: number;
    node1: number;
}
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
export declare class Action {
    /** The type of the action. */
    readonly type: ActionType;
    /** Any additional data needed to convey the desired action. */
    readonly payload: ActionPayload;
    /** The player number who is requesting the action. */
    readonly player: number;
    constructor(type: ActionType, player?: number, payload?: ActionPayload);
    serialized: () => string;
    static deserialize: (serializedObj: string) => Action;
}
export default Action;
