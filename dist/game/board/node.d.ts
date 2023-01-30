import Loggable from '../loggable';
import Port from './port';
/**
 * A node on our board.
 */
export declare class Node implements Loggable {
    /** The player number who has built on this node. -1 if none. */
    private player;
    /** If the node has a city. */
    private city;
    /** The node's port or null if none. Set at initialization. */
    private port;
    /**
     * Convenience method to check if node is empty.
     * Preferrable to `node.getPlayer() === -1` everywhere.
     * @returns True if empty.
     */
    isEmpty: () => boolean;
    /**
     * @returns The port object or null if no port.
     */
    getPort: () => Port | null;
    /**
     * @returns The number of the player on this node, -1 if none.
     */
    getPlayer: () => number;
    /**
     * @returns Boolean indicating if this node has a city.
     */
    hasCity: () => boolean;
    /**
     * Build a settlement on this node.
     * @param player The settlement's player number.
     */
    buildSettlement(player: number): void;
    /**
     * Upgrade a settlement to a city on this node.
     */
    buildCity(): void;
    /**
     * Set the port. Can only be done once.
     * @param port The port to set.
     */
    setPort(port: Port): void;
    toLog: () => string;
}
export default Node;
