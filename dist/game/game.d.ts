/**
 * The fundamental game object. Declares and defines a clear public interface for interacting
 * with the game and manages all the logic internally.
 * @module
 */
import Player from './player';
import ResourceBundle from './resource/resource_bundle';
import Action from './action';
import { TurnState } from './turn_fsm';
import DevCardBundle from './dev_card/dev_card_bundle';
import TradeOffer from './trade_offer';
import Loggable from './loggable';
/**
 * Enum of game phases.
 */
export declare enum GamePhase {
    SetupForward = "Forward Setup",
    SetupBackward = "Backward Setup",
    Playing = "Playing",
    Finished = "Finished"
}
/**
 * We design the game object to have a "reasonable" level of protection. We do this
 * to balance data protection with ease of access and to avoid large overhead from
 * getters/setters. The rule of thumb is primitives are private and have getters,
 * and objects are readonly. However, some objects, such as the board, are private.
 */
export declare class Game implements Loggable {
    /** A resource bundle for the bank. */
    readonly bank: ResourceBundle;
    /** The dev card deck. */
    readonly deck: DevCardBundle;
    /** The board. */
    private readonly board;
    /** The current turn number takes on a value of: [0, NUM_PLAYERS] */
    private turn;
    /** Convenience var to get the player obj of the current turn. */
    private currPlayer;
    /** The last roll */
    private lastRoll;
    /** List of player objects. Indexable by player number. */
    readonly players: Player[];
    /** A list of open trade offers in the current turn. */
    private tradeOffers;
    /** The current phase of the game. */
    private phase;
    /** The winner. */
    private winner;
    /** The current turn's state, i.e. Postroll, preroll, etc. */
    private turnState;
    /** The number of roads the current turn's player can place for no cost. */
    private freeRoads;
    /** Boolean list of players who still need to submit discard actions. */
    private mustDiscard;
    /** Boolean indicating if we have rolled on the current turn yet. */
    private hasRolled;
    /** Boolean indicating if a dev card has been played on the current turn. */
    private hasPlayedDevCard;
    /** Node where the last settlement during setup was built. */
    private setupLastSettlement;
    /** [owner, amount] of largest army. */
    readonly largestArmy: {
        owner: number;
        size: number;
    };
    /** [owner, length] of longest road */
    readonly longestRoad: {
        owner: number;
        len: number;
    };
    /** A bundle of dev cards bought on the current turn. */
    readonly purchasedCards: DevCardBundle;
    constructor();
    private transferLongestRoad;
    private checkWinner;
    private do_roll;
    private do_buildSettlement;
    private do_buildRoad;
    private do_buildCity;
    private do_playRobber;
    private do_moveRobber;
    private do_Rob;
    private do_playMonopoly;
    private do_selectMonopolyResource;
    private do_playYearOfPlenty;
    private do_selectYearOfPlentyResources;
    private do_playRoadBuilder;
    private do_discard;
    private do_drawDevCard;
    private do_exchange;
    private do_makeTradeOffer;
    private do_decideOnTradeOffer;
    private do_endTurn;
    private doAction;
    private verifyActionWithState;
    /**
     * Check if an action is valid.
     * @param action The action requested to be done
     * @returns Boolean indicating if the action is valid.
     */
    isValidAction(action: Action): {
        valid: boolean;
        status: string;
    };
    /**
     * (1) Check if an action is valid, (2) make action deterministic (edge cases),
     * then (3) do the action.
     * @param action The action to be handled.
     * @returns `null` if `action` is invalid, the completed, valid action otherwise.
     */
    handleAction(action: Action): null | Action;
    getTurn: () => number;
    getLastRoll: () => number;
    getTradeOffers: () => TradeOffer[];
    getPhase: () => GamePhase;
    getWinner: () => number;
    getTurnState: () => TurnState;
    getFreeRoads: () => number;
    getMustDiscard: () => boolean[];
    getHasRolled: () => boolean;
    getTile: (t: number) => import("..").Tile;
    getNode: (n: number) => import("..").Node;
    getRoad: (n0: number, n1: number) => number;
    getRobberTile: () => number;
    getRobberVictims: () => number[];
    toLog: () => string;
}
export default Game;
