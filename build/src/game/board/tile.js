"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tile = void 0;
const resource_1 = require("../resource/resource");
/**
 * A tile on the board.
 */
class Tile {
    constructor(resource, nodes) {
        /** The number of the tile. Used in calculating resource production. */
        this.number = -1;
        this.getNumber = () => this.number;
        this.toLog = () => `(${this.number}, ${(0, resource_1.resStr)(this.resource)})`;
        this.resource = resource;
        this.nodes = nodes;
    }
    /**
     * Set the number for the tile. This can only be done once.
     * @param number The value we want to set.
     */
    setNumber(number) {
        if (this.number !== -1)
            return;
        this.number = number;
    }
    /**
     * Check if a tile is adjacent to this tile.
     * @param other The other tile.
     * @returns true if this tile is adjacent to `other`
     */
    isAdjacentTo(other) {
        for (let i = 0; i < this.nodes.length; i++) {
            if (other.nodes.includes(this.nodes[i]))
                return true;
        }
        return false;
    }
}
exports.Tile = Tile;
exports.default = Tile;
