import Node from './node';
import Tile from './tile';
import Graph from './graph';
import Loggable from '../loggable';
/**
 * A game board. The board manages the internal logic
 * for the underlying undirected graph and its own state.
 * It is **agnostic** of game state and will never check if
 * a call to its public interface violates game state.
 */
export declare class Board implements Loggable {
    /** List of node objects, indexable by node number. */
    readonly nodes: Node[];
    /** Graph of nodes. Edge weight -1 indicates connection edge weight > -1 indicates road
     * for the player number of that weight.
     */
    readonly roadnetwork: Graph<number>;
    /** List of tiles objects indexable by tile number. */
    readonly tiles: Tile[];
    /** The tile number the robber is on. */
    robber: number;
    constructor();
    private generateRoadNetwork;
    private generateNodes;
    private generateTiles;
    /**
     * Given a connected graph g find its longest trail.
     * @param g The graph. Every node degree is on [0, 3].
     * @returns The length of the longest trail.
     */
    private longestRoadOn;
    /**
     * Calculates the longest road length of player `player`.
     * @param player The player number to check.
     * @returns Length in number of roads.
     */
    getLongestRoad(player: number): number;
    /**
     * Get players who can be robbed.
     * @returns List of player numbers who have structures on nodes incident on
     * the robber tile.
     */
    playersOnRobber(): number[];
    /**
     * Build a road for player number `player`, if one doesn't already
     * exist, between nodes `nid0` and `nid1`.
     * @param nid0 First node.
     * @param nid1 Second node.
     * @param player The player number.
     */
    buildRoad(nid0: number, nid1: number, player: number): void;
    /**
     * Get the player number for a road between two nodes.
     * @param nid0 First node.
     * @param nid1 Second node.
     * @returns -1 If no road or if the nodes aren't adjacent. The player number
     * of the road otherwise.
     */
    getRoad(nid0: number, nid1: number): number;
    /**
     * Get all adjacent nodes.
     * @param nid The node id we want to get the adjacent nodes for.
     * @returns List of adjacent node ids.
     */
    adjacentTo: (nid: number) => number[];
    toLog: () => string;
}
export default Board;
