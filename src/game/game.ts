/**
 * The fundamental game object. Declares and defines a clear public interface for interacting
 * with the game and manages all the logic internally.
 * @module
 */

import {
  NUM_EACH_RESOURCE,
  NUM_KNIGHTS,
  NUM_VPS,
  NUM_MONOPOLY,
  NUM_PLAYERS,
  NUM_ROAD_BUILDING,
  NUM_YEAR_OF_PLENTY,
  NUM_RESOURCE_TYPES,
  ROBBER_LIMIT,
  NUM_TILES,
  NUM_NODES,
  MIN_LONGEST_ROAD,
  MIN_LARGEST_ARMY,
  VPS_TO_WIN,
} from "./constants";
import Player from "./player";
import ResourceBundle from "./resource/resource_bundle";
import Action, {
  ActionType,
  BuildCityPayload,
  BuildRoadPayload,
  BuildSettlementPayload,
  DiscardPayload,
  DrawDevCardPayload,
  ExchangePayload,
  MakeTradeOfferPayload,
  MoveRobberPayload,
  RobPayload,
  RollPayload,
  SelectMonopolyResourcePayload,
  SelectYearOfPlentyResourcesPayload,
  TradeOfferDecisionPayload,
} from "./action";
import isValidTransition, { TurnState } from "./turn_fsm";
import { rollDie } from "./utils";
import DevCardBundle from "./dev_card/dev_card_bundle";
import Board from "./board/board";
import Resource from "./resource/resource";
import DevCard from "./dev_card/dev_card";
import TradeOffer, { TradeStatus } from "./trade_offer";
import Loggable from "./loggable";

/**
 * Enum of game phases.
 */
export enum GamePhase {
  SetupForward = "Forward Setup",
  SetupBackward = "Backward Setup",
  Playing = "Playing",
  Finished = "Finished",
}

/**
 * We design the game object to have a "reasonable" level of protection. We do this
 * to balance data protection with ease of access and to avoid large overhead from
 * getters/setters. The rule of thumb is primitives are private and have getters,
 * and objects are readonly. However, some objects, such as the board, are private.
 */
export class Game implements Loggable {
  /** A resource bundle for the bank. */
  readonly bank: ResourceBundle;
  /** The dev card deck. */
  readonly deck: DevCardBundle;
  /** The board. */
  readonly board: Board;
  /** The current turn number takes on a value of: [0, NUM_PLAYERS] */
  private turn: number;
  /** Convenience var to get the player obj of the current turn. */
  currPlayer: Player;
  /** The last roll */
  private lastRoll: [number, number];
  /** List of player objects. Indexable by player number. */
  readonly players: Player[];
  /** A list of open trade offers in the current turn. */
  private tradeOffers: TradeOffer[];
  /** The current phase of the game. */
  private phase: GamePhase;
  /** The winner. */
  private winner: number;
  /** The current turn's state, i.e. Postroll, preroll, etc. */
  private turnState: TurnState;
  /** The number of roads the current turn's player can place for no cost. */
  private freeRoads: number;
  /** Boolean list of players who still need to submit discard actions. */
  private mustDiscard: boolean[];
  /** Boolean indicating if we have rolled on the current turn yet. */
  private hasRolled: boolean;
  /** Boolean indicating if a dev card has been played on the current turn. */
  private hasPlayedDevCard: boolean;
  /** Node where the last settlement during setup was built. */
  private setupLastSettlement: number;
  /** [owner, amount] of largest army. */
  readonly largestArmy: { owner: number; size: number };
  /** [owner, length] of longest road */
  readonly longestRoad: { owner: number; len: number };
  /** A bundle of dev cards bought on the current turn. */
  readonly purchasedCards: DevCardBundle;

  constructor() {
    this.bank = new ResourceBundle(NUM_EACH_RESOURCE);
    this.deck = new DevCardBundle([
      NUM_KNIGHTS,
      NUM_VPS,
      NUM_YEAR_OF_PLENTY,
      NUM_MONOPOLY,
      NUM_ROAD_BUILDING,
    ]);
    this.board = new Board();
    this.turn = 0;
    this.players = [...Array(NUM_PLAYERS)].map(() => new Player());
    this.currPlayer = this.players[this.turn];
    this.tradeOffers = [];
    this.freeRoads = 0;
    this.hasRolled = false;
    this.hasPlayedDevCard = false;
    this.purchasedCards = new DevCardBundle();

    this.phase = GamePhase.SetupForward;
    this.winner = -1;
    this.lastRoll = [-1, -1];
    this.setupLastSettlement = -1;

    this.turnState = TurnState.SetupSettlement;
    this.mustDiscard = [...Array(NUM_PLAYERS)].map(() => false);
    this.largestArmy = { owner: -1, size: MIN_LARGEST_ARMY - 1 };
    this.longestRoad = { owner: -1, len: MIN_LONGEST_ROAD - 1 };
  }

  private transferLongestRoad(owner: number, length: number) {
    if (this.longestRoad.owner !== -1)
      this.players[this.longestRoad.owner].victoryPoints -= 2;
    this.longestRoad.owner = owner;
    this.longestRoad.len = length;
    this.players[owner].victoryPoints += 2;
  }

  private checkWinner() {
    for (let i = 0; i < NUM_PLAYERS; i++) {
      if (this.players[i].victoryPoints >= VPS_TO_WIN) {
        this.phase = GamePhase.Finished;
        this.winner = i;
        return;
      }
    }
  }

  // ============================ do_ helper methods ============================

  // do_ prefixed functions are helpers to actually do their respective actions.
  // these **change** game state.

  private do_roll(action: Action) {
    const { dice } = action.payload as RollPayload;
    this.lastRoll = dice;
    const value = dice[0] + dice[1];
    if (value !== 7) {
      // Standard case. Hand out resources.

      // Production for each player.
      const production: ResourceBundle[] = [...Array(NUM_PLAYERS)].map(
        () => new ResourceBundle()
      );

      // For every tile, update the production of each player.
      const prodTiles = this.board.tiles.filter(
        (tile, i) => this.board.robber !== i && tile.getNumber() === value
      );

      for (let i = 0; i < prodTiles.length; i++) {
        const tile = prodTiles[i];
        for (let j = 0; j < tile.nodes.length; j++) {
          const node = this.board.nodes[tile.nodes[j]];
          if (!node.isEmpty()) {
            production[node.getPlayer()].add(
              tile.resource,
              node.hasCity() ? 2 : 1
            );
          }
        }
      }

      // Check if the bank has enough of each resource.
      for (let i = 0; i < NUM_RESOURCE_TYPES; i++) {
        let sum = 0;
        for (let j = 0; j < production.length; j++) {
          sum += production[j].get(i as Resource);
        }
        // If there is not enough of a resource, noone gets it.
        if (sum > this.bank.get(i as Resource)) {
          production.forEach((bundle) => bundle.removeAll(i as Resource));
        }
      }

      // Finally distribute the production bundles to their respective players.
      for (let i = 0; i < production.length; i++) {
        this.players[i].resources.add(production[i]);
        this.bank.subtract(production[i]);
      }

      this.turnState = TurnState.Postroll;
    } else {
      // Robber case.
      this.mustDiscard = this.players.map(
        ({ resources }) => resources.size() > ROBBER_LIMIT
      );

      // If someone is over the limit, we move to discarding state before moving robber.
      // Otherwise we just move to moving robber state.
      this.turnState = this.mustDiscard.includes(true)
        ? TurnState.Discarding
        : TurnState.MovingRobber;
    }
    this.hasRolled = true;
  }

  // Build things.

  private do_buildSettlement(action: Action) {
    const { node } = action.payload as BuildSettlementPayload;
    if (this.phase === GamePhase.Playing) {
      this.board.nodes[node].buildSettlement(this.turn);
      ResourceBundle.trade(
        ResourceBundle.settlementCost,
        this.currPlayer.resources,
        new ResourceBundle(),
        this.bank
      );

      // If you don't own the longest road, we need to check if your built settlement
      // disrupted who has the longest road.
      if (this.longestRoad.owner !== this.turn) {
        for (let i = 0; i < NUM_PLAYERS; i++) {
          const myLength = this.board.getLongestRoad(i);
          if (myLength > this.longestRoad.len)
            this.transferLongestRoad(i, myLength);
        }
      }
    } else {
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
      this.turnState = TurnState.SetupRoad;
    }
    // Post processing.
    const port = this.board.nodes[node].getPort();
    if (port !== null) {
      const prevRates = this.currPlayer.rates;
      for (let i = 0; i < port.resources.length; i++) {
        const res = port.resources[i] as Resource;
        prevRates.set(res, Math.min(prevRates.get(res), port.rate));
      }
    }
    this.currPlayer.victoryPoints++;
    this.currPlayer.settlements--;
    this.checkWinner();
  }

  private do_buildRoad(action: Action) {
    const { node0, node1 } = action.payload as BuildRoadPayload;
    this.currPlayer.roads--;
    if (this.phase === GamePhase.Playing) {
      this.board.buildRoad(node0, node1, this.turn);
      if (this.freeRoads === 0) {
        ResourceBundle.trade(
          ResourceBundle.roadCost,
          this.currPlayer.resources,
          new ResourceBundle(),
          this.bank
        );
      } else {
        this.freeRoads--;
      }

      // Check if longest road needs to be updated.
      const myLength = this.board.getLongestRoad(this.turn);
      if (myLength > this.longestRoad.len) {
        this.transferLongestRoad(this.turn, myLength);
        this.checkWinner();
      }
    } else {
      // Setup case. just build the road where requested.
      this.board.buildRoad(node0, node1, this.turn);
      if (this.phase === GamePhase.SetupForward) {
        if (this.turn === NUM_PLAYERS - 1) {
          this.phase = GamePhase.SetupBackward;
        } else {
          this.turn++;
          this.currPlayer = this.players[this.turn];
        }
        this.turnState = TurnState.SetupSettlement;
      } else {
        if (this.turn === 0) {
          this.phase = GamePhase.Playing;
          this.turnState = TurnState.Preroll;
        } else {
          this.turn--;
          this.currPlayer = this.players[this.turn];
          this.turnState = TurnState.SetupSettlement;
        }
      }
    }
  }

  private do_buildCity(action: Action) {
    const { node } = action.payload as BuildCityPayload;
    this.board.nodes[node].buildCity();
    ResourceBundle.trade(
      ResourceBundle.cityCost,
      this.currPlayer.resources,
      new ResourceBundle(),
      this.bank
    );
    this.currPlayer.victoryPoints++;
    this.currPlayer.cities--;
    this.checkWinner();
  }

  // Play dev cards.

  private do_playRobber() {
    this.currPlayer.devCards.remove(DevCard.Knight);
    this.currPlayer.knightsPlayed++;
    const { owner, size } = this.largestArmy;
    if (this.currPlayer.knightsPlayed > size) {
      if (owner !== -1) this.players[owner].victoryPoints -= 2;
      this.currPlayer.victoryPoints += 2;
      this.largestArmy.owner = this.turn;
      this.largestArmy.size = this.currPlayer.knightsPlayed;
      this.checkWinner();
    }
    this.turnState = TurnState.MovingRobber;
    this.hasPlayedDevCard = true;
  }

  private do_moveRobber(action: Action) {
    const { to } = action.payload as MoveRobberPayload;
    this.board.robber = to;
    if (this.getRobberVictims().length > 0) {
      this.turnState = TurnState.Robbing;
    } else {
      this.turnState = this.hasRolled ? TurnState.Postroll : TurnState.Preroll;
    }
  }

  private do_Rob(action: Action) {
    const { victim } = action.payload as RobPayload;
    const res: Resource = this.players[victim].resources.removeOneAtRandom();
    this.currPlayer.resources.add(res, 1);
    this.turnState = this.hasRolled ? TurnState.Postroll : TurnState.Preroll;
  }

  private do_playMonopoly() {
    this.currPlayer.devCards.remove(DevCard.Monopoly);
    this.turnState = TurnState.SelectingMonopolyResource;
    this.hasPlayedDevCard = true;
  }

  private do_selectMonopolyResource(action: Action) {
    const { resource } = action.payload as SelectMonopolyResourcePayload;
    for (let i = 0; i < NUM_PLAYERS; i++) {
      if (i === this.turn) continue;
      const amnt = this.players[i].resources.removeAll(resource);
      this.currPlayer.resources.add(resource, amnt);
    }
    this.turnState = this.hasRolled ? TurnState.Postroll : TurnState.Preroll;
  }

  private do_playYearOfPlenty() {
    this.currPlayer.devCards.remove(DevCard.YearOfPlenty);
    this.turnState = TurnState.SelectingYearOfPlentyResources;
    this.hasPlayedDevCard = true;
  }

  private do_selectYearOfPlentyResources(action: Action) {
    const { resources } = action.payload as SelectYearOfPlentyResourcesPayload;
    for (let i = 0; i < 2; i++) {
      this.currPlayer.resources.add(resources[i], 1);
      this.bank.subtract(resources[i], 1);
    }
    this.turnState = this.hasRolled ? TurnState.Postroll : TurnState.Preroll;
  }

  private do_playRoadBuilder() {
    this.currPlayer.devCards.remove(DevCard.RoadBuilder);
    this.freeRoads = 2;
    this.turnState = this.hasRolled ? TurnState.Postroll : TurnState.Preroll;
    this.hasPlayedDevCard = true;
  }

  private do_discard(action: Action) {
    const { bundle } = action.payload as DiscardPayload;
    this.players[action.player].resources.subtract(bundle);
    this.bank.add(bundle);
    this.mustDiscard[action.player] = false;

    // If someone is over the limit, we move to discarding state before moving robber.
    // Otherwise we just move to moving robber state.
    this.turnState = this.mustDiscard.includes(true)
      ? TurnState.Discarding
      : TurnState.MovingRobber;
  }

  private do_drawDevCard(action: Action) {
    const { card } = action.payload as DrawDevCardPayload;
    ResourceBundle.trade(
      ResourceBundle.devCardCost,
      this.currPlayer.resources,
      new ResourceBundle(),
      this.bank
    );
    this.purchasedCards.add(card);
    this.deck.remove(card);
    if (card === DevCard.VictoryPoint) {
      this.currPlayer.victoryPoints++;
      this.checkWinner();
    }
  }

  private do_exchange(action: Action) {
    const { offer, request } = action.payload as ExchangePayload;
    const rate = this.currPlayer.rates.get(offer);
    this.bank.add(offer, rate);
    this.bank.subtract(request, 1);
    this.currPlayer.resources.add(request, 1);
    this.currPlayer.resources.subtract(offer, rate);
  }

  // Trades

  private do_makeTradeOffer(action: Action) {
    const { offer, request } = action.payload as MakeTradeOfferPayload;
    const id =
      this.tradeOffers.length > 0
        ? this.tradeOffers[this.tradeOffers.length - 1].id + 1
        : 0;
    this.tradeOffers.push(
      new TradeOffer(id, this.turn, action.player, offer, request)
    );
  }

  private do_decideOnTradeOffer(action: Action) {
    const { status, withPlayer, id } =
      action.payload as TradeOfferDecisionPayload;
    const index = this.tradeOffers.findIndex((to) => to.id === id);
    const tradeOffer: TradeOffer = this.tradeOffers[index];

    if (tradeOffer.offerer === action.player) {
      if (status === TradeStatus.Decline) {
        // Case 0: Closing a trade offer we own.
        this.tradeOffers.splice(index, 1);
      } else if (withPlayer !== undefined) {
        // Case 1: Trading with a player who accepted our offer.
        ResourceBundle.trade(
          tradeOffer.request,
          this.players[withPlayer].resources,
          tradeOffer.offer,
          this.players[action.player].resources
        );
        this.tradeOffers.splice(index, 1);
      }
    } else {
      // Case 2: Change our status on some other trade offer.
      tradeOffer.status[action.player] = status;

      // If our declination means everyone declined, delete the offer.
      if (status === TradeStatus.Decline && tradeOffer.allDeclined()) {
        this.tradeOffers.splice(index, 1);
      }
    }
  }

  private do_endTurn() {
    this.currPlayer.devCards.add(this.purchasedCards);
    this.purchasedCards.empty();
    this.freeRoads = 0;
    this.turn = (this.turn + 1) % NUM_PLAYERS;
    this.currPlayer = this.players[this.turn];
    this.hasRolled = false;
    this.hasPlayedDevCard = false;
    this.turnState = TurnState.Preroll;
    this.tradeOffers = [];
  }

  private doAction(action: Action): void {
    const { type } = action;
    if (type === ActionType.Roll) {
      this.do_roll(action);
    } else if (type === ActionType.PlayRobber) {
      this.do_playRobber();
    } else if (type === ActionType.MoveRobber) {
      this.do_moveRobber(action);
    } else if (type === ActionType.Rob) {
      this.do_Rob(action);
    } else if (type === ActionType.PlayMonopoly) {
      this.do_playMonopoly();
    } else if (type === ActionType.SelectMonopolyResource) {
      this.do_selectMonopolyResource(action);
    } else if (type === ActionType.PlayYearOfPlenty) {
      this.do_playYearOfPlenty();
    } else if (type === ActionType.SelectYearOfPlentyResources) {
      this.do_selectYearOfPlentyResources(action);
    } else if (type === ActionType.PlayRoadBuilder) {
      this.do_playRoadBuilder();
    } else if (type === ActionType.BuildSettlement) {
      this.do_buildSettlement(action);
    } else if (type === ActionType.BuildCity) {
      this.do_buildCity(action);
    } else if (type === ActionType.BuildRoad) {
      this.do_buildRoad(action);
    } else if (type === ActionType.Discard) {
      this.do_discard(action);
    } else if (type === ActionType.MakeTradeOffer) {
      this.do_makeTradeOffer(action);
    } else if (type === ActionType.DecideOnTradeOffer) {
      this.do_decideOnTradeOffer(action);
    } else if (type === ActionType.DrawDevCard) {
      this.do_drawDevCard(action);
    } else if (type === ActionType.Exchange) {
      this.do_exchange(action);
    } else {
      this.do_endTurn();
    }
  }

  private verifyActionWithState(action: Action): boolean {
    const { type, payload, player } = action;
    if (type === ActionType.Roll) {
      const { dice } = payload as RollPayload;
      if (dice === undefined) return true;
      const value = dice[0] + dice[1];
      return value > 0 && value < 13;
    } else if (type === ActionType.PlayRobber) {
      return (
        !this.hasPlayedDevCard && this.currPlayer.devCards.has(DevCard.Knight)
      );
    } else if (type === ActionType.MoveRobber) {
      const { to } = payload as MoveRobberPayload;
      return to > -1 && to < NUM_TILES && to !== this.board.robber;
    } else if (type === ActionType.Rob) {
      const { victim } = payload as RobPayload;
      const selectable = this.board.playersOnRobber();
      return (
        victim !== -1 &&
        victim !== player &&
        selectable.includes(victim) &&
        this.players[victim].resources.size() > 0
      );
    } else if (type === ActionType.PlayMonopoly) {
      return (
        !this.hasPlayedDevCard && this.currPlayer.devCards.has(DevCard.Monopoly)
      );
    } else if (type === ActionType.PlayYearOfPlenty) {
      return (
        !this.hasPlayedDevCard &&
        this.currPlayer.devCards.has(DevCard.YearOfPlenty)
      );
    } else if (type === ActionType.SelectYearOfPlentyResources) {
      const [res1, res2] = (<SelectYearOfPlentyResourcesPayload>payload)
        .resources;
      return this.bank.get(res1) > 1 && this.bank.get(res2) > 1;
    } else if (type === ActionType.PlayRoadBuilder) {
      return (
        !this.hasPlayedDevCard &&
        this.currPlayer.devCards.has(DevCard.RoadBuilder)
      );
    } else if (type === ActionType.BuildSettlement) {
      const node: number = (<BuildSettlementPayload>payload).node;
      return (
        node > -1 &&
        node < NUM_NODES &&
        this.board.nodes[node].isEmpty() &&
        this.players[player].settlements > 0 &&
        !this.board
          .adjacentTo(node)
          .some((other) => !this.board.nodes[other].isEmpty()) &&
        (this.phase !== GamePhase.Playing ||
          (this.currPlayer.resources.has(ResourceBundle.settlementCost) &&
            this.board
              .adjacentTo(node)
              .some((other) => this.board.getRoad(node, other) === this.turn)))
      );
    } else if (type === ActionType.BuildCity) {
      const node: number = (<BuildCityPayload>payload).node;
      return (
        node > -1 &&
        node < NUM_NODES &&
        this.players[player].cities > 0 &&
        this.board.nodes[node].getPlayer() === this.turn &&
        !this.board.nodes[node].hasCity() &&
        this.currPlayer.resources.has(ResourceBundle.cityCost)
      );
    } else if (type === ActionType.BuildRoad) {
      const { node0, node1 } = <BuildRoadPayload>payload;
      const nodesValid =
        node0 > -1 && node1 > -1 && node0 < NUM_NODES && node1 < NUM_NODES;
      if (!nodesValid) return false;
      const adj0 = this.board.adjacentTo(node0);
      const adj1 = this.board.adjacentTo(node1);
      return (
        this.players[player].roads > 0 &&
        adj0.includes(node1) && // nodes adjacent and
        this.board.getRoad(node0, node1) === -1 && // no road there yet and
        ((this.phase !== GamePhase.Playing &&
          (node1 === this.setupLastSettlement ||
            node0 === this.setupLastSettlement)) ||
          this.freeRoads > 0 ||
          (this.hasRolled &&
            this.currPlayer.resources.has(ResourceBundle.roadCost))) && // can buy a road or its setup
        (this.board.nodes[node0].getPlayer() === this.turn || // settlement on node 0 or
          this.board.nodes[node1].getPlayer() === this.turn || // settlement on node 1 or
          adj0.some(
            (onid0) => this.board.getRoad(onid0, node0) === this.turn
          ) || // road we own incident on node 0 or
          adj1.some((onid1) => this.board.getRoad(onid1, node1) === this.turn)) // road we own incident on node 1
      );
    } else if (type === ActionType.Discard) {
      const { bundle } = payload as DiscardPayload;
      return (
        this.mustDiscard[player] &&
        this.players[player].resources.has(bundle) &&
        bundle.bundle.reduce((prev, curr) => curr + prev, 0) ===
          Math.floor(this.players[player].resources.size() / 2)
      );
    } else if (type === ActionType.MakeTradeOffer) {
      const { offer } = payload as MakeTradeOfferPayload;
      return this.players[player].resources.has(offer as ResourceBundle);
    } else if (type === ActionType.DecideOnTradeOffer) {
      const { status, id, withPlayer } = payload as TradeOfferDecisionPayload;
      const to = this.tradeOffers.find((offer) => offer.id === id);
      if (to === undefined) return false;
      const isOwner = action.player === to.offerer;
      if (isOwner) {
        return (
          status === TradeStatus.Decline || // closing the trade offer you own OR
          (withPlayer !== undefined && // Accepting a trade with someone else where
            withPlayer !== to.offerer && // you both have the correct resources and they accepted
            to.status[withPlayer] === TradeStatus.Accept &&
            this.players[withPlayer].resources.has(to.request) &&
            this.players[to.offerer].resources.has(to.offer))
        );
      } else {
        // You can only accept if you have the resources.
        return (
          to.status[action.player] !== undefined && // you are in the trade offer AND
          (status !== TradeStatus.Accept ||
            this.players[action.player].resources.has(to.request))
        );
      }
    } else if (type === ActionType.DrawDevCard) {
      const { card } = payload as DrawDevCardPayload;
      return (
        !this.deck.isEmpty() &&
        this.currPlayer.resources.has(ResourceBundle.devCardCost) &&
        (card === undefined || this.deck.has(card))
      );
    } else if (type === ActionType.Exchange) {
      const { offer, request } = payload as ExchangePayload;
      const rate = this.currPlayer.rates.get(offer);
      return (
        this.currPlayer.resources.get(offer) >= rate &&
        this.bank.get(request) > 1
      );
    }
    return true;
  }

  // ============================ Public Interface ============================

  /**
   * Check if an action is valid.
   * @param action The action requested to be done
   * @returns Boolean indicating if the action is valid.
   */
  public isValidAction(action: Action): { valid: boolean; status: string } {
    // Has someone already won?
    if (this.phase === GamePhase.Finished)
      return { valid: false, status: "The game is over." };

    // Is this action restricted only to the player of the current turn?
    if (
      action.player != this.turn &&
      (this.turnState === TurnState.Preroll ||
        ![
          ActionType.Discard,
          ActionType.MakeTradeOffer,
          ActionType.DecideOnTradeOffer,
        ].includes(action.type))
    ) {
      return { valid: false, status: "Restricted action." };
    }
    // Is the requested action an acceptable transition given
    // the current `turnState`?
    if (!isValidTransition(this.turnState, action)) {
      return { valid: false, status: "Invalid transition." };
    }

    // So if the action is correct given the `player` and it is correct given
    // the state of the turn, is it valid given the rest of the game's state?
    const valid = this.verifyActionWithState(action);
    return { valid, status: valid ? "works!" : "Violates game state." };
  }

  /**
   * (1) Check if an action is valid, (2) make action deterministic (edge cases),
   * then (3) do the action.
   * @param action The action to be handled.
   * @returns `null` if `action` is invalid, the completed, valid action otherwise.
   */
  public handleAction(action: Action): null | Action {
    // Determine if the action can be done given current game state.
    const { valid, status } = this.isValidAction(action);
    if (!valid) {
      console.log(status);
      return null;
    }
    // The two edge cases where we need to update our action's payload due
    // to randomness
    if (action.type === ActionType.Roll) {
      const payload = <RollPayload>action.payload;
      if (payload.dice === undefined) payload.dice = [rollDie(), rollDie()];
    } else if (action.type === ActionType.DrawDevCard) {
      const payload = <DrawDevCardPayload>action.payload;
      if (payload.card === undefined)
        payload.card = this.deck.pickOneAtRandom();
    }

    // Safely update internal state based on the validated action.
    this.doAction(action);

    // return the completed, valid action.
    return action;
  }

  // Getter methods.

  public getTurn = () => this.turn;
  public getLastRoll = () => this.lastRoll;
  public getTradeOffers = () => this.tradeOffers;
  public getPhase = () => this.phase;
  public getWinner = () => this.winner;
  public getTurnState = () => this.turnState;
  public getFreeRoads = () => this.freeRoads;
  public getMustDiscard = () => this.mustDiscard;
  public getHasRolled = () => this.hasRolled;
  public getTile = (t: number) => this.board.tiles[t];
  public getNode = (n: number) => this.board.nodes[n];
  public getRoad = (n0: number, n1: number) => this.board.getRoad(n0, n1);
  public getRobberTile = () => this.board.robber;
  public getRobberVictims = () =>
    this.board
      .playersOnRobber()
      .filter((p) => p !== this.turn && this.players[p].resources.size() > 0);

  toLog = () => {
    let o = "";
    o += this.board.toLog() + "\n";
    o +=
      "Last Roll: " +
      this.lastRoll +
      " | Phase: " +
      this.phase +
      " | State: " +
      this.turnState +
      " | Player's Turn: " +
      (this.turn + 1) +
      "\n";
    o += "Players: \n";
    for (let i = 0; i < NUM_PLAYERS; i++)
      o += `  Player ${i + 1}:\n` + this.players[i].toLog() + "\n";
    o += "Trade Offers: \n";
    for (let i = 0; i < this.tradeOffers.length; i++)
      o += this.tradeOffers[i].toLog() + "\n";
    o += "Bank: " + this.bank.toLog() + "\n";
    o += "Deck: " + this.deck.toLog() + "\n";
    o += "Largest Army: ";
    o +=
      (this.largestArmy["owner"] === -1
        ? "None"
        : "Player " +
          (this.largestArmy["owner"] + 1) +
          ", Size " +
          this.largestArmy["size"]) + "\n";
    o += "Longest Road: ";
    o +=
      (this.longestRoad["owner"] === -1
        ? "None"
        : "Player " +
          (this.longestRoad["owner"] + 1) +
          ", Size " +
          this.longestRoad["len"]) + "\n";
    o += "Free Roads: " + this.freeRoads + " | Winner: ";
    o += this.winner === -1 ? "None" : "Player " + (this.winner + 1) + "\n";
    if (this.mustDiscard.includes(true))
      o += "mustDiscard: " + this.mustDiscard.toString() + "\n";
    return o;
  };
}

export default Game;
