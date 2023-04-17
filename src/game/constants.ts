/**
 * A bunch of constants so we can avoid magic number :)
 * @module
 */

import Resource from "./resource/resource";

export const NUM_RESOURCE_TYPES: number = 5;
export const NUM_EACH_RESOURCE_TILE: number[] = [3, 4, 3, 4, 4];
export const NUM_DEV_CARD_TYPES: number = 5;
export const NUM_PLAYERS: number = 4;
export const NUM_SETTLEMENTS: number = 5;
export const NUM_CITIES: number = 4;
export const NUM_ROADS: number = 15;
export const NUM_EACH_RESOURCE: number = 19;
export const NUM_VPS: number = 5;
export const NUM_KNIGHTS: number = 14;
export const NUM_ROAD_BUILDING: number = 2;
export const NUM_YEAR_OF_PLENTY: number = 2;
export const NUM_MONOPOLY: number = 2;

export const RES_PER_SETTLEMENT: number = 1;
export const RES_PER_CITY: number = 2;

export const MIN_LONGEST_ROAD: number = 5;
export const MIN_LARGEST_ARMY: number = 3;

export const BANK_RATE: number = 4;

export const VPS_TO_WIN: number = 10;

/**
 * If you have more than `ROBBER_LIMIT` cards when a 7 is rolled, you must
 * discard half your cards.
 */
export const ROBBER_LIMIT: number = 7;

/** Board stuff. TODO I'm lazy and these shouldn't be constants it
 * should be calculated mathematically but ill come around to it.
 */
export const NUM_NODES: number = 54;
export const NUM_EDGES: number = 72;
export const NUM_TILES: number = 19;

// [node id, node id, port resource]
export const HAVE_PORTS: [number, number, Resource | 5][] = [
  [0, 1, 5],
  [3, 4, Resource.Wool],
  [7, 17, Resource.Ore],
  [14, 15, 5],
  [26, 37, 5],
  [28, 38, Resource.Grain],
  [45, 46, Resource.Brick],
  [47, 48, 5],
  [50, 51, Resource.Lumber],
];
