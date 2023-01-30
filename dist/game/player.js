"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const constants_1 = require("./constants");
const dev_card_bundle_1 = __importDefault(require("./dev_card/dev_card_bundle"));
const resource_bundle_1 = __importDefault(require("./resource/resource_bundle"));
class Player {
    constructor() {
        this.toLog = () => `resources: [ ${this.resources.toLog()} ], devCards: [ ${this.devCards.toLog()} ], vps: ${this.victoryPoints} cities: ${this.cities} settlements: ${this.settlements} roads: ${this.roads}`;
        this.resources = new resource_bundle_1.default();
        this.rates = new resource_bundle_1.default(constants_1.BANK_RATE);
        this.devCards = new dev_card_bundle_1.default();
        this.knightsPlayed = 0;
        this.victoryPoints = 0;
        this.cities = constants_1.NUM_CITIES;
        this.settlements = constants_1.NUM_SETTLEMENTS;
        this.roads = constants_1.NUM_ROADS;
    }
}
exports.Player = Player;
exports.default = Player;
//# sourceMappingURL=player.js.map