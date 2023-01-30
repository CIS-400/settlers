"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
/**
 * A node on our board.
 */
class Node {
    constructor() {
        /** The player number who has built on this node. -1 if none. */
        this.player = -1;
        /** If the node has a city. */
        this.city = false;
        /** The node's port or null if none. Set at initialization. */
        this.port = null;
        /**
         * Convenience method to check if node is empty.
         * Preferrable to `node.getPlayer() === -1` everywhere.
         * @returns True if empty.
         */
        this.isEmpty = () => this.player === -1;
        /**
         * @returns The port object or null if no port.
         */
        this.getPort = () => this.port;
        /**
         * @returns The number of the player on this node, -1 if none.
         */
        this.getPlayer = () => this.player;
        /**
         * @returns Boolean indicating if this node has a city.
         */
        this.hasCity = () => this.city;
        this.toLog = () => this.isEmpty()
            ? '(_, empty)'
            : `(${this.player}, ${this.city ? 'city' : 'set'})`;
    }
    /**
     * Build a settlement on this node.
     * @param player The settlement's player number.
     */
    buildSettlement(player) {
        if (this.player !== -1)
            return;
        this.player = player;
    }
    /**
     * Upgrade a settlement to a city on this node.
     */
    buildCity() {
        if (this.player === -1)
            return;
        this.city = true;
    }
    /**
     * Set the port. Can only be done once.
     * @param port The port to set.
     */
    setPort(port) {
        if (this.port !== null)
            return;
        this.port = port;
    }
}
exports.Node = Node;
exports.default = Node;
