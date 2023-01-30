"use strict";
/**
 * A bunch of constants so we can avoid magic number :)
 * @module
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HAVE_PORTS = exports.NUM_TILES = exports.NUM_EDGES = exports.NUM_NODES = exports.ROBBER_LIMIT = exports.VPS_TO_WIN = exports.BANK_RATE = exports.MIN_LARGEST_ARMY = exports.MIN_LONGEST_ROAD = exports.RES_PER_CITY = exports.RES_PER_SETTLEMENT = exports.NUM_MONOPOLY = exports.NUM_YEAR_OF_PLENTY = exports.NUM_ROAD_BUILDING = exports.NUM_KNIGHTS = exports.NUM_VPS = exports.NUM_EACH_RESOURCE = exports.NUM_ROADS = exports.NUM_CITIES = exports.NUM_SETTLEMENTS = exports.NUM_PLAYERS = exports.NUM_DEV_CARD_TYPES = exports.NUM_EACH_RESOURCE_TILE = exports.NUM_RESOURCE_TYPES = void 0;
exports.NUM_RESOURCE_TYPES = 5;
exports.NUM_EACH_RESOURCE_TILE = [3, 4, 3, 4, 4];
exports.NUM_DEV_CARD_TYPES = 5;
exports.NUM_PLAYERS = 4;
exports.NUM_SETTLEMENTS = 5;
exports.NUM_CITIES = 4;
exports.NUM_ROADS = 15;
exports.NUM_EACH_RESOURCE = 19;
exports.NUM_VPS = 5;
exports.NUM_KNIGHTS = 14;
exports.NUM_ROAD_BUILDING = 2;
exports.NUM_YEAR_OF_PLENTY = 2;
exports.NUM_MONOPOLY = 2;
exports.RES_PER_SETTLEMENT = 1;
exports.RES_PER_CITY = 2;
exports.MIN_LONGEST_ROAD = 5;
exports.MIN_LARGEST_ARMY = 3;
exports.BANK_RATE = 4;
exports.VPS_TO_WIN = 10;
/**
 * If you have more than `ROBBER_LIMIT` cards when a 7 is rolled, you must
 * discard half your cards.
 */
exports.ROBBER_LIMIT = 7;
/** Board stuff. TODO I'm lazy and these shouldn't be constants it
 * should be calculated mathematically but ill come around to it.
 */
exports.NUM_NODES = 54;
exports.NUM_EDGES = 72;
exports.NUM_TILES = 19;
exports.HAVE_PORTS = [
    [0, 1],
    [3, 4],
    [7, 17],
    [14, 15],
    [26, 37],
    [28, 38],
    [45, 46],
    [47, 48],
    [50, 51],
];
//# sourceMappingURL=constants.js.map