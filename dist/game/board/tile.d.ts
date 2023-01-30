import Loggable from '../loggable';
import Resource from '../resource/resource';
/**
 * A tile on the board.
 */
export declare class Tile implements Loggable {
    /** The resource of the tile. Set once at initialization. */
    readonly resource: Resource;
    /** The nodeids of the nodes incident on this tile. Set once at initialization. */
    readonly nodes: number[];
    /** The number of the tile. Used in calculating resource production. */
    private number;
    constructor(resource: Resource, nodes: number[]);
    /**
     * Set the number for the tile. This can only be done once.
     * @param number The value we want to set.
     */
    setNumber(number: number): void;
    getNumber: () => number;
    /**
     * Check if a tile is adjacent to this tile.
     * @param other The other tile.
     * @returns true if this tile is adjacent to `other`
     */
    isAdjacentTo(other: Tile): boolean;
    toLog: () => string;
}
export default Tile;
