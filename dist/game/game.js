"use strict";
/**
 * The fundamental game object. Declares and defines a clear public interface for interacting
 * with the game and manages all the logic internally.
 * @module
 */
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
exports.Game = exports.GamePhase = void 0;
const constants_1 = require("./constants");
const player_1 = __importDefault(require("./player"));
const resource_bundle_1 = __importDefault(require("./resource/resource_bundle"));
const action_1 = require("./action");
const turn_fsm_1 = __importStar(require("./turn_fsm"));
const utils_1 = require("./utils");
const dev_card_bundle_1 = __importDefault(require("./dev_card/dev_card_bundle"));
const board_1 = __importDefault(require("./board/board"));
const dev_card_1 = __importDefault(require("./dev_card/dev_card"));
const trade_offer_1 = __importStar(require("./trade_offer"));
/**
 * Enum of game phases.
 */
var GamePhase;
(function (GamePhase) {
    GamePhase["SetupForward"] = "Forward Setup";
    GamePhase["SetupBackward"] = "Backward Setup";
    GamePhase["Playing"] = "Playing";
    GamePhase["Finished"] = "Finished";
})(GamePhase = exports.GamePhase || (exports.GamePhase = {}));
/**
 * We design the game object to have a "reasonable" level of protection. We do this
 * to balance data protection with ease of access and to avoid large overhead from
 * getters/setters. The rule of thumb is primitives are private and have getters,
 * and objects are readonly. However, some objects, such as the board, are private.
 */
class Game {
    constructor() {
        // Getter methods.
        this.getTurn = () => this.turn;
        this.getLastRoll = () => this.lastRoll;
        this.getTradeOffers = () => this.tradeOffers;
        this.getPhase = () => this.phase;
        this.getWinner = () => this.winner;
        this.getTurnState = () => this.turnState;
        this.getFreeRoads = () => this.freeRoads;
        this.getMustDiscard = () => this.mustDiscard;
        this.getHasRolled = () => this.hasRolled;
        this.getTile = (t) => this.board.tiles[t];
        this.getNode = (n) => this.board.nodes[n];
        this.getRoad = (n0, n1) => this.board.getRoad(n0, n1);
        this.getRobberTile = () => this.board.robber;
        this.getRobberVictims = () => this.board
            .playersOnRobber()
            .filter((p) => p !== this.turn && this.players[p].resources.size() > 0);
        this.toLog = () => {
            let o = '';
            o += this.board.toLog() + '\n';
            o +=
                'lastRoll: ' +
                    this.lastRoll +
                    ' | phase: ' +
                    this.phase +
                    ' | turnState: ' +
                    this.turnState +
                    ' | turn: ' +
                    this.turn +
                    '\n';
            o += 'Players: \n';
            for (let i = 0; i < constants_1.NUM_PLAYERS; i++)
                o += this.players[i].toLog() + '\n';
            o += 'Trade Offers: \n';
            for (let i = 0; i < this.tradeOffers.length; i++)
                o += this.tradeOffers[i].toLog() + '\n';
            o += 'Bank: ' + this.bank.toLog() + '\n';
            o += 'Deck: ' + this.deck.toLog() + '\n';
            o += 'Largest Army: ' + JSON.stringify(this.largestArmy) + '\n';
            o += 'Longest Road: ' + JSON.stringify(this.longestRoad) + '\n';
            o +=
                'Free Roads: ' +
                    this.freeRoads +
                    ' | hasRolled: ' +
                    this.hasRolled +
                    ' | winner: ' +
                    this.winner +
                    '\n';
            if (this.mustDiscard.includes(true))
                o += 'mustDiscard: ' + this.mustDiscard.toString() + '\n';
            return o;
        };
        this.bank = new resource_bundle_1.default(constants_1.NUM_EACH_RESOURCE);
        this.deck = new dev_card_bundle_1.default([
            constants_1.NUM_KNIGHTS,
            constants_1.NUM_VPS,
            constants_1.NUM_YEAR_OF_PLENTY,
            constants_1.NUM_MONOPOLY,
            constants_1.NUM_ROAD_BUILDING,
        ]);
        this.board = new board_1.default();
        this.turn = 0;
        this.players = [...Array(constants_1.NUM_PLAYERS)].map(() => new player_1.default());
        this.currPlayer = this.players[this.turn];
        this.tradeOffers = [];
        this.freeRoads = 0;
        this.hasRolled = false;
        this.hasPlayedDevCard = false;
        this.purchasedCards = new dev_card_bundle_1.default();
        this.phase = GamePhase.SetupForward;
        this.winner = -1;
        this.lastRoll = -1;
        this.setupLastSettlement = -1;
        this.turnState = turn_fsm_1.TurnState.SetupSettlement;
        this.mustDiscard = [...Array(constants_1.NUM_PLAYERS)].map(() => false);
        this.largestArmy = { owner: -1, size: constants_1.MIN_LARGEST_ARMY - 1 };
        this.longestRoad = { owner: -1, len: constants_1.MIN_LONGEST_ROAD - 1 };
    }
    transferLongestRoad(owner, length) {
        if (this.longestRoad.owner !== -1)
            this.players[this.longestRoad.owner].victoryPoints -= 2;
        this.longestRoad.owner = owner;
        this.longestRoad.len = length;
        this.players[owner].victoryPoints += 2;
    }
    checkWinner() {
        for (let i = 0; i < constants_1.NUM_PLAYERS; i++) {
            if (this.players[i].victoryPoints >= constants_1.VPS_TO_WIN) {
                this.phase = GamePhase.Finished;
                this.winner = i;
                return;
            }
        }
    }
    // ============================ do_ helper methods ============================
    // do_ prefixed functions are helpers to actually do their respective actions.
    // these **change** game state.
    do_roll(action) {
        const { value } = action.payload;
        this.lastRoll = value;
        if (value !== 7) {
            // Standard case. Hand out resources.
            // Production for each player.
            const production = [...Array(constants_1.NUM_PLAYERS)].map(() => new resource_bundle_1.default());
            // For every tile, update the production of each player.
            const prodTiles = this.board.tiles.filter((tile, i) => this.board.robber !== i && tile.getNumber() === value);
            for (let i = 0; i < prodTiles.length; i++) {
                const tile = prodTiles[i];
                for (let j = 0; j < tile.nodes.length; j++) {
                    const node = this.board.nodes[tile.nodes[j]];
                    if (!node.isEmpty()) {
                        production[node.getPlayer()].add(tile.resource, node.hasCity() ? 2 : 1);
                    }
                }
            }
            // Check if the bank has enough of each resource.
            for (let i = 0; i < constants_1.NUM_RESOURCE_TYPES; i++) {
                let sum = 0;
                for (let j = 0; j < production.length; j++) {
                    sum += production[j].get(i);
                }
                // If there is not enough of a resource, noone gets it.
                if (sum > this.bank.get(i)) {
                    production.forEach((bundle) => bundle.removeAll(i));
                }
            }
            // Finally distribute the production bundles to their respective players.
            for (let i = 0; i < production.length; i++) {
                this.players[i].resources.add(production[i]);
            }
            this.turnState = turn_fsm_1.TurnState.Postroll;
        }
        else {
            // Robber case.
            this.mustDiscard = this.players.map(({ resources }) => resources.size() > constants_1.ROBBER_LIMIT);
            // If someone is over the limit, we move to discarding state before moving robber.
            // Otherwise we just move to moving robber state.
            this.turnState = this.mustDiscard.includes(true)
                ? turn_fsm_1.TurnState.Discarding
                : turn_fsm_1.TurnState.MovingRobber;
        }
        this.hasRolled = true;
    }
    // Build things.
    do_buildSettlement(action) {
        const { node } = action.payload;
        if (this.phase === GamePhase.Playing) {
            this.board.nodes[node].buildSettlement(this.turn);
            resource_bundle_1.default.trade(resource_bundle_1.default.settlementCost, this.currPlayer.resources, new resource_bundle_1.default(), this.bank);
            // If you don't own the longest road, we need to check if your built settlement
            // disrupted who has the longest road.
            if (this.longestRoad.owner !== this.turn) {
                for (let i = 0; i < constants_1.NUM_PLAYERS; i++) {
                    const myLength = this.board.getLongestRoad(i);
                    if (myLength > this.longestRoad.len)
                        this.transferLongestRoad(i, myLength);
                }
            }
            this.checkWinner();
        }
        else {
            // Setup case. just build the settlement where requested.
            this.board.nodes[node].buildSettlement(this.turn);
            this.setupLastSettlement = node;
            // If this is our second setup phase settlement, collect resources.
            if (this.phase === GamePhase.SetupBackward) {
                this.board.tiles
                    .filter(({ nodes }) => nodes.includes(node))
                    .forEach(({ resource }) => {
                    this.currPlayer.resources.add(resource, 1);
                    this.bank.subtract(resource, 1);
                });
            }
            this.turnState = turn_fsm_1.TurnState.SetupRoad;
        }
        // Post processing.
        const port = this.board.nodes[node].getPort();
        if (port !== null) {
            const prevRates = this.currPlayer.rates;
            for (let i = 0; i < port.resources.length; i++) {
                const res = port.resources[i];
                prevRates.set(res, Math.min(prevRates.get(res), port.rate));
            }
        }
        this.currPlayer.victoryPoints++;
        this.currPlayer.settlements--;
    }
    do_buildRoad(action) {
        const { node0, node1 } = action.payload;
        this.currPlayer.roads--;
        if (this.phase === GamePhase.Playing) {
            this.board.buildRoad(node0, node1, this.turn);
            if (this.freeRoads === 0) {
                resource_bundle_1.default.trade(resource_bundle_1.default.roadCost, this.currPlayer.resources, new resource_bundle_1.default(), this.bank);
            }
            else {
                this.freeRoads--;
            }
            // Check if longest road needs to be updated.
            const myLength = this.board.getLongestRoad(this.turn);
            if (myLength > this.longestRoad.len) {
                this.transferLongestRoad(this.turn, myLength);
                this.checkWinner();
            }
        }
        else {
            // Setup case. just build the road where requested.
            this.board.buildRoad(node0, node1, this.turn);
            if (this.phase === GamePhase.SetupForward) {
                if (this.turn === constants_1.NUM_PLAYERS - 1) {
                    this.phase = GamePhase.SetupBackward;
                }
                else {
                    this.turn++;
                    this.currPlayer = this.players[this.turn];
                }
                this.turnState = turn_fsm_1.TurnState.SetupSettlement;
            }
            else {
                if (this.turn === 0) {
                    this.phase = GamePhase.Playing;
                    this.turnState = turn_fsm_1.TurnState.Preroll;
                }
                else {
                    this.turn--;
                    this.currPlayer = this.players[this.turn];
                    this.turnState = turn_fsm_1.TurnState.SetupSettlement;
                }
            }
        }
    }
    do_buildCity(action) {
        const { node } = action.payload;
        this.board.nodes[node].buildCity();
        resource_bundle_1.default.trade(resource_bundle_1.default.cityCost, this.currPlayer.resources, new resource_bundle_1.default(), this.bank);
        this.currPlayer.victoryPoints++;
        this.currPlayer.cities--;
        this.checkWinner();
    }
    // Play dev cards.
    do_playRobber() {
        this.currPlayer.devCards.remove(dev_card_1.default.Knight);
        this.currPlayer.knightsPlayed++;
        const { owner, size } = this.largestArmy;
        if (this.currPlayer.knightsPlayed > size) {
            if (owner !== -1)
                this.players[owner].victoryPoints -= 2;
            this.currPlayer.victoryPoints += 2;
            this.largestArmy.owner = this.turn;
            this.largestArmy.size = this.currPlayer.knightsPlayed;
            this.checkWinner();
        }
        this.turnState = turn_fsm_1.TurnState.MovingRobber;
        this.hasPlayedDevCard = true;
    }
    do_moveRobber(action) {
        const { to } = action.payload;
        this.board.robber = to;
        if (this.getRobberVictims().length > 0) {
            this.turnState = turn_fsm_1.TurnState.Robbing;
        }
        else {
            this.turnState = this.hasRolled ? turn_fsm_1.TurnState.Postroll : turn_fsm_1.TurnState.Preroll;
        }
    }
    do_Rob(action) {
        const { victim } = action.payload;
        const res = this.players[victim].resources.removeOneAtRandom();
        this.currPlayer.resources.add(res, 1);
        this.turnState = this.hasRolled ? turn_fsm_1.TurnState.Postroll : turn_fsm_1.TurnState.Preroll;
    }
    do_playMonopoly() {
        this.currPlayer.devCards.remove(dev_card_1.default.Monopoly);
        this.turnState = turn_fsm_1.TurnState.SelectingMonopolyResource;
        this.hasPlayedDevCard = true;
    }
    do_selectMonopolyResource(action) {
        const { resource } = action.payload;
        for (let i = 0; i < constants_1.NUM_PLAYERS; i++) {
            if (i === this.turn)
                continue;
            const amnt = this.players[i].resources.removeAll(resource);
            this.currPlayer.resources.add(resource, amnt);
        }
        this.turnState = this.hasRolled ? turn_fsm_1.TurnState.Postroll : turn_fsm_1.TurnState.Preroll;
    }
    do_playYearOfPlenty() {
        this.currPlayer.devCards.remove(dev_card_1.default.YearOfPlenty);
        this.turnState = turn_fsm_1.TurnState.SelectingYearOfPlentyResources;
        this.hasPlayedDevCard = true;
    }
    do_selectYearOfPlentyResources(action) {
        const { resources } = action.payload;
        for (let i = 0; i < 2; i++) {
            this.currPlayer.resources.add(resources[i], 1);
            this.bank.subtract(i, 1);
        }
        this.turnState = this.hasRolled ? turn_fsm_1.TurnState.Postroll : turn_fsm_1.TurnState.Preroll;
    }
    do_playRoadBuilder() {
        this.currPlayer.devCards.remove(dev_card_1.default.RoadBuilder);
        this.freeRoads = 2;
        this.turnState = this.hasRolled ? turn_fsm_1.TurnState.Postroll : turn_fsm_1.TurnState.Preroll;
        this.hasPlayedDevCard = true;
    }
    do_discard(action) {
        const { bundle } = action.payload;
        this.players[action.player].resources.subtract(bundle);
        this.mustDiscard[action.player] = false;
        // If someone is over the limit, we move to discarding state before moving robber.
        // Otherwise we just move to moving robber state.
        this.turnState = this.mustDiscard.includes(true) ? turn_fsm_1.TurnState.Discarding : turn_fsm_1.TurnState.MovingRobber;
    }
    do_drawDevCard(action) {
        const { card } = action.payload;
        resource_bundle_1.default.trade(resource_bundle_1.default.devCardCost, this.currPlayer.resources, new resource_bundle_1.default(), this.bank);
        this.purchasedCards.add(card);
        this.deck.remove(card);
        if (card === dev_card_1.default.VictoryPoint) {
            this.currPlayer.victoryPoints++;
            this.checkWinner();
        }
    }
    do_exchange(action) {
        const { offer, request } = action.payload;
        const rate = this.currPlayer.rates.get(offer);
        this.bank.add(offer, rate);
        this.bank.subtract(request, 1);
        this.currPlayer.resources.add(request, 1);
        this.currPlayer.resources.subtract(offer, rate);
    }
    // Trades
    do_makeTradeOffer(action) {
        const { offer, request } = action.payload;
        const id = this.tradeOffers.length > 0 ? this.tradeOffers[this.tradeOffers.length - 1].id + 1 : 0;
        this.tradeOffers.push(new trade_offer_1.default(id, this.turn, action.player, offer, request));
    }
    do_decideOnTradeOffer(action) {
        const { status, withPlayer, id } = action.payload;
        const index = this.tradeOffers.findIndex((to) => to.id === id);
        const tradeOffer = this.tradeOffers[index];
        if (tradeOffer.offerer === action.player) {
            if (status === trade_offer_1.TradeStatus.Decline) {
                // Case 0: Closing a trade offer we own.
                this.tradeOffers.splice(index, 1);
            }
            else if (withPlayer !== undefined) {
                // Case 1: Trading with a player who accepted our offer.
                resource_bundle_1.default.trade(tradeOffer.request, this.players[withPlayer].resources, tradeOffer.offer, this.players[action.player].resources);
                this.tradeOffers.splice(index, 1);
            }
        }
        else {
            // Case 2: Change our status on some other trade offer.
            tradeOffer.status[action.player] = status;
            // If our declination means everyone declined, delete the offer.
            if (status === trade_offer_1.TradeStatus.Decline && tradeOffer.allDeclined()) {
                this.tradeOffers.splice(index, 1);
            }
        }
    }
    do_endTurn() {
        this.currPlayer.devCards.add(this.purchasedCards);
        this.purchasedCards.empty();
        this.freeRoads = 0;
        this.turn = (this.turn + 1) % constants_1.NUM_PLAYERS;
        this.currPlayer = this.players[this.turn];
        this.hasRolled = false;
        this.hasPlayedDevCard = false;
        this.turnState = turn_fsm_1.TurnState.Preroll;
        this.tradeOffers = [];
    }
    doAction(action) {
        const { type } = action;
        if (type === action_1.ActionType.Roll) {
            this.do_roll(action);
        }
        else if (type === action_1.ActionType.PlayRobber) {
            this.do_playRobber();
        }
        else if (type === action_1.ActionType.MoveRobber) {
            this.do_moveRobber(action);
        }
        else if (type === action_1.ActionType.Rob) {
            this.do_Rob(action);
        }
        else if (type === action_1.ActionType.PlayMonopoly) {
            this.do_playMonopoly();
        }
        else if (type === action_1.ActionType.SelectMonopolyResource) {
            this.do_selectMonopolyResource(action);
        }
        else if (type === action_1.ActionType.PlayYearOfPlenty) {
            this.do_playYearOfPlenty();
        }
        else if (type === action_1.ActionType.SelectYearOfPlentyResources) {
            this.do_selectYearOfPlentyResources(action);
        }
        else if (type === action_1.ActionType.PlayRoadBuilder) {
            this.do_playRoadBuilder();
        }
        else if (type === action_1.ActionType.BuildSettlement) {
            this.do_buildSettlement(action);
        }
        else if (type === action_1.ActionType.BuildCity) {
            this.do_buildCity(action);
        }
        else if (type === action_1.ActionType.BuildRoad) {
            this.do_buildRoad(action);
        }
        else if (type === action_1.ActionType.Discard) {
            this.do_discard(action);
        }
        else if (type === action_1.ActionType.MakeTradeOffer) {
            this.do_makeTradeOffer(action);
        }
        else if (type === action_1.ActionType.DecideOnTradeOffer) {
            this.do_decideOnTradeOffer(action);
        }
        else if (type === action_1.ActionType.DrawDevCard) {
            this.do_drawDevCard(action);
        }
        else if (type === action_1.ActionType.Exchange) {
            this.do_exchange(action);
        }
        else {
            this.do_endTurn();
        }
    }
    verifyActionWithState(action) {
        const { type, payload, player } = action;
        if (type === action_1.ActionType.Roll) {
            const { value } = payload;
            return value === undefined || (value > 0 && value < 13);
        }
        else if (type === action_1.ActionType.PlayRobber) {
            return !this.hasPlayedDevCard && this.currPlayer.devCards.has(dev_card_1.default.Knight);
        }
        else if (type === action_1.ActionType.MoveRobber) {
            const { to } = payload;
            return to > -1 && to < constants_1.NUM_TILES && to !== this.board.robber;
        }
        else if (type === action_1.ActionType.Rob) {
            const { victim } = payload;
            const selectable = this.board.playersOnRobber();
            return (victim !== -1 &&
                victim !== player &&
                selectable.includes(victim) &&
                this.players[victim].resources.size() > 0);
        }
        else if (type === action_1.ActionType.PlayMonopoly) {
            return !this.hasPlayedDevCard && this.currPlayer.devCards.has(dev_card_1.default.Monopoly);
        }
        else if (type === action_1.ActionType.PlayYearOfPlenty) {
            return !this.hasPlayedDevCard && this.currPlayer.devCards.has(dev_card_1.default.YearOfPlenty);
        }
        else if (type === action_1.ActionType.SelectYearOfPlentyResources) {
            const [res1, res2] = payload.resources;
            return this.bank.get(res1) > 1 && this.bank.get(res2) > 1;
        }
        else if (type === action_1.ActionType.PlayRoadBuilder) {
            return !this.hasPlayedDevCard && this.currPlayer.devCards.has(dev_card_1.default.RoadBuilder);
        }
        else if (type === action_1.ActionType.BuildSettlement) {
            const node = payload.node;
            return (node > -1 &&
                node < constants_1.NUM_NODES &&
                this.board.nodes[node].isEmpty() &&
                !this.board.adjacentTo(node).some((other) => !this.board.nodes[other].isEmpty()) &&
                (this.phase !== GamePhase.Playing ||
                    (this.currPlayer.resources.has(resource_bundle_1.default.settlementCost) &&
                        this.board
                            .adjacentTo(node)
                            .some((other) => this.board.getRoad(node, other) === this.turn))));
        }
        else if (type === action_1.ActionType.BuildCity) {
            const node = payload.node;
            return (node > -1 &&
                node < constants_1.NUM_NODES &&
                this.board.nodes[node].getPlayer() === this.turn &&
                !this.board.nodes[node].hasCity() &&
                this.currPlayer.resources.has(resource_bundle_1.default.cityCost));
        }
        else if (type === action_1.ActionType.BuildRoad) {
            const { node0, node1 } = payload;
            const nodesValid = node0 > -1 && node1 > -1 && node0 < constants_1.NUM_NODES && node1 < constants_1.NUM_NODES;
            if (!nodesValid)
                return false;
            const adj0 = this.board.adjacentTo(node0);
            const adj1 = this.board.adjacentTo(node1);
            return (adj0.includes(node1) && // nodes adjacent and
                this.board.getRoad(node0, node1) === -1 && // no road there yet and
                ((this.phase !== GamePhase.Playing &&
                    (node1 === this.setupLastSettlement || node0 === this.setupLastSettlement)) ||
                    this.freeRoads > 0 ||
                    (this.hasRolled && this.currPlayer.resources.has(resource_bundle_1.default.roadCost))) && // can buy a road or its setup
                (this.board.nodes[node0].getPlayer() === this.turn || // settlement on node 0 or
                    this.board.nodes[node1].getPlayer() === this.turn || // settlement on node 1 or
                    adj0.some((onid0) => this.board.getRoad(onid0, node0) === this.turn) || // road we own incident on node 0 or
                    adj1.some((onid1) => this.board.getRoad(onid1, node1) === this.turn)) // road we own incident on node 1
            );
        }
        else if (type === action_1.ActionType.Discard) {
            const { bundle } = payload;
            return (this.mustDiscard[player] &&
                this.players[player].resources.has(bundle) &&
                bundle.size() === Math.floor(this.players[player].resources.size() / 2));
        }
        else if (type === action_1.ActionType.MakeTradeOffer) {
            const { offer } = payload;
            return this.players[player].resources.has(offer);
        }
        else if (type === action_1.ActionType.DecideOnTradeOffer) {
            const { status, id, withPlayer } = payload;
            const to = this.tradeOffers.find((offer) => offer.id === id);
            if (to === undefined)
                return false;
            const isOwner = action.player === to.offerer;
            if (isOwner) {
                return (status === trade_offer_1.TradeStatus.Decline || // closing the trade offer you own OR
                    (withPlayer !== undefined && // Accepting a trade with someone else where
                        withPlayer !== to.offerer && // you both have the correct resources and they accepted
                        to.status[withPlayer] === trade_offer_1.TradeStatus.Accept &&
                        this.players[withPlayer].resources.has(to.request) &&
                        this.players[to.offerer].resources.has(to.offer)));
            }
            else {
                // You can only accept if you have the resources.
                return (to.status[action.player] !== undefined && // you are in the trade offer AND
                    (status !== trade_offer_1.TradeStatus.Accept || this.players[action.player].resources.has(to.request)));
            }
        }
        else if (type === action_1.ActionType.DrawDevCard) {
            const { card } = payload;
            return (!this.deck.isEmpty() &&
                this.currPlayer.resources.has(resource_bundle_1.default.devCardCost) &&
                (card === undefined || this.deck.has(card)));
        }
        else if (type === action_1.ActionType.Exchange) {
            const { offer, request } = payload;
            const rate = this.currPlayer.rates.get(offer);
            return this.currPlayer.resources.get(offer) >= rate && this.bank.get(request) > 1;
        }
        return true;
    }
    // ============================ Public Interface ============================
    /**
     * Check if an action is valid.
     * @param action The action requested to be done
     * @returns Boolean indicating if the action is valid.
     */
    isValidAction(action) {
        // Has someone already won?
        if (this.phase === GamePhase.Finished)
            return { valid: false, status: 'The game is over.' };
        // Is this action restricted only to the player of the current turn?
        if (action.player != this.turn &&
            (this.turnState === turn_fsm_1.TurnState.Preroll ||
                ![action_1.ActionType.Discard, action_1.ActionType.MakeTradeOffer, action_1.ActionType.DecideOnTradeOffer].includes(action.type))) {
            return { valid: false, status: 'Restricted action.' };
        }
        // Is the requested action an acceptable transition given
        // the current `turnState`?
        if (!(0, turn_fsm_1.default)(this.turnState, action)) {
            return { valid: false, status: 'Invalid transition.' };
        }
        // So if the action is correct given the `player` and it is correct given
        // the state of the turn, is it valid given the rest of the game's state?
        const valid = this.verifyActionWithState(action);
        return { valid, status: valid ? 'works!' : 'Violates game state.' };
    }
    /**
     * (1) Check if an action is valid, (2) make action deterministic (edge cases),
     * then (3) do the action.
     * @param action The action to be handled.
     * @returns `null` if `action` is invalid, the completed, valid action otherwise.
     */
    handleAction(action) {
        // Determine if the action can be done given current game state.
        const { valid, status } = this.isValidAction(action);
        if (!valid) {
            console.log(status);
            return null;
        }
        // The two edge cases where we need to update our action's payload due
        // to randomness
        if (action.type === action_1.ActionType.Roll) {
            const payload = action.payload;
            if (payload.value === undefined)
                payload.value = (0, utils_1.rollDie)() + (0, utils_1.rollDie)();
        }
        else if (action.type === action_1.ActionType.DrawDevCard) {
            const payload = action.payload;
            if (payload.card === undefined)
                payload.card = this.deck.pickOneAtRandom();
        }
        // Safely update internal state based on the validated action.
        this.doAction(action);
        // return the completed, valid action.
        return action;
    }
}
exports.Game = Game;
exports.default = Game;
//# sourceMappingURL=game.js.map