"use strict";
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
exports.Board = void 0;
const constants_1 = require("../constants");
const node_1 = __importDefault(require("./node"));
const tile_1 = __importDefault(require("./tile"));
const utils_1 = require("../utils");
const graph_1 = __importDefault(require("./graph"));
const port_1 = __importDefault(require("./port"));
const resource_1 = __importStar(require("../resource/resource"));
/**
 * A game board. The board manages the internal logic
 * for the underlying undirected graph and its own state.
 * It is **agnostic** of game state and will never check if
 * a call to its public interface violates game state.
 */
class Board {
    constructor() {
        /** The tile number the robber is on. */
        this.robber = -1;
        /**
         * Get all adjacent nodes.
         * @param nid The node id we want to get the adjacent nodes for.
         * @returns List of adjacent node ids.
         */
        this.adjacentTo = (nid) => this.roadnetwork.children(nid);
        this.toLog = () => {
            let tiles = '\n  ';
            for (let i = 0; i < this.tiles.length; i++) {
                if (i === 3 || i === 7 || i === 12 || i === 16 || i === 19) {
                    tiles += '\n  ';
                }
                tiles += `{ id: ${i} | ${(0, resource_1.resStr)(this.tiles[i].resource)} | ${this.tiles[i].getNumber()} } `;
            }
            let o = 'tiles:' + tiles + '\nnodes:';
            for (let i = 0; i < this.nodes.length; i++) {
                if (!this.nodes[i].isEmpty()) {
                    o += `\n  { id: ${i} | player: ${this.nodes[i].getPlayer()} | ${this.nodes[i].hasCity() ? 'city' : 'settlement'} }`;
                }
            }
            o += `\nrobber: ${this.robber}`;
            return o;
        };
        this.roadnetwork = this.generateRoadNetwork();
        this.nodes = this.generateNodes();
        this.tiles = this.generateTiles(); // Generate tiles & set robber.
    }
    generateRoadNetwork() {
        const g = new graph_1.default([...Array(constants_1.NUM_NODES)].map((_, i) => i));
        // Establish our connections.
        const rowSize = [7, 9, 11, 11, 9, 7]; // nodes per row
        const downOffset = [8, 10, 11, 10, 8];
        let col = 0;
        let row = 0;
        for (let i = 0; i < constants_1.NUM_NODES; i++) {
            // establish the connection between node and its right node
            if (col + 1 !== rowSize[row]) {
                g.addEdge(i, i + 1);
            }
            // establish the conneciton between node and its downward node
            if (row < 3 && col % 2 == 0) {
                g.addEdge(i, i + downOffset[row]);
            }
            else if ((row == 3 || row == 4) && col % 2 == 1) {
                g.addEdge(i, i + downOffset[row]);
            }
            col++;
            if (col == rowSize[row]) {
                col = 0;
                row++;
            }
        }
        return g;
    }
    generateNodes() {
        const nodes = [...Array(constants_1.NUM_NODES)].map(() => new node_1.default());
        // Assign ports randomly.
        const ports = [...Array(constants_1.NUM_RESOURCE_TYPES + 1)].map(() => 1);
        ports[constants_1.NUM_RESOURCE_TYPES] = 4; // Set 3:1 ports.
        for (let i = 0; i < constants_1.HAVE_PORTS.length; i++) {
            const [node0, node1] = constants_1.HAVE_PORTS[i];
            const index = (0, utils_1.weightedRandom)(ports);
            ports[index]--;
            let port;
            if (index === constants_1.NUM_RESOURCE_TYPES) {
                port = new port_1.default([...Array(constants_1.NUM_RESOURCE_TYPES).keys()], 3);
            }
            else {
                port = new port_1.default([index], 2);
            }
            nodes[node0].setPort(port);
            nodes[node1].setPort(port);
        }
        return nodes;
    }
    generateTiles() {
        const tiles = new Array(constants_1.NUM_TILES);
        const resources = [...constants_1.NUM_EACH_RESOURCE_TILE, 1]; // The 1 is for None (desert)
        // Make tile objects. lmao wish i was good at math
        const rowSize = [3, 4, 5, 4, 3];
        const rowFirstNid = [0, 7, 16, 28, 39];
        const rowNidOffset = [8, 10, 11, 10, 8];
        let row = 0;
        let col = 0;
        for (let i = 0; i < constants_1.NUM_TILES; i++) {
            // Select a random resource for this tile.
            const index = (0, utils_1.weightedRandom)(resources);
            resources[index]--;
            // Calculate the node ids of of its nodes.
            const nid = 2 * col + rowFirstNid[row];
            const offset = nid + rowNidOffset[row];
            const nids = [nid, nid + 1, nid + 2, offset, offset + 1, offset + 2];
            tiles[i] = new tile_1.default(index, nids);
            col++;
            // We should update to the next row.
            if (col == rowSize[row]) {
                col = 0;
                row++;
            }
        }
        // Distribute tokens.
        // Number number token `i` is `tokens[i - 2]`
        const temp = [1, 2, 2, 2, 2];
        const tokens = [...temp, 0, ...temp.reverse()];
        // Distribute 6s and 8s first to ensure seperation.
        const choosable = [...Array(constants_1.NUM_TILES).keys()].map((i) => tiles[i].resource !== resource_1.default.None ? 1 : 0);
        for (let i = 0; i < 4; i++) {
            const index = (0, utils_1.weightedRandom)(choosable);
            const number = tokens[4] > 0 ? 6 : 8;
            tiles[index].setNumber(number);
            tokens[number - 2]--;
            for (let j = 0; j < choosable.length; j++) {
                if (choosable[j] === 1 && tiles[index].isAdjacentTo(tiles[j])) {
                    choosable[j] = 0;
                }
            }
        }
        // Distribute the rest of the tokens.
        for (let i = 0; i < constants_1.NUM_TILES; i++) {
            if (tiles[i].getNumber() !== -1)
                continue;
            // If None (desert), index is 5 since number is 7. Otherwise
            // do a weighted random pick.
            const index = tiles[i].resource !== resource_1.default.None ? (0, utils_1.weightedRandom)(tokens) : 5;
            tiles[i].setNumber(index + 2);
            // If tile is desert, also just set the robber.
            if (tiles[i].resource === resource_1.default.None) {
                this.robber = i;
            }
            else {
                tokens[index]--;
            }
        }
        return tiles;
    }
    /**
     * Given a connected graph g find its longest trail.
     * @param g The graph. Every node degree is on [0, 3].
     * @returns The length of the longest trail.
     */
    longestRoadOn(g) {
        const oddDeg = [];
        const nodes = g.nodes();
        for (let i = 0; i < nodes.length; i++) {
            if (g.degree(nodes[i]) % 2 === 1)
                oddDeg.push(nodes[i]);
        }
        // If at most 2 odd-degree, eulerian path exists, just return edgeCount.
        return oddDeg.length <= 2 ? g.edgeCount() : Math.max(...oddDeg.map((i) => (0, utils_1.maxTrail)(g, i)));
    }
    /**
     * Calculates the longest road length of player `player`.
     * @param player The player number to check.
     * @returns Length in number of roads.
     */
    getLongestRoad(player) {
        // Step 0: Preprocessing. Convert player's roads into a graph.
        const edges = []; // edges to add to our graph.
        for (let i = 0; i < constants_1.NUM_NODES; i++) {
            const node = this.nodes[i];
            // Check right.
            if (this.roadnetwork.getWeight(i, i + 1) === player) {
                if (!node.isEmpty() && node.getPlayer() !== player) {
                    edges.push([`${i}_l`, `${i + 1}`]);
                }
                else if (!this.nodes[i + 1].isEmpty() && this.nodes[i + 1].getPlayer() !== player) {
                    edges.push([`${i}`, `${i + 1}_r`]);
                }
                else {
                    edges.push([`${i}`, `${i + 1}`]);
                }
            }
            // Check down
            const below = this.roadnetwork.children(i).filter((id) => id > i + 1)[0];
            if (below !== undefined && this.roadnetwork.getWeight(i, below) === player) {
                if (!node.isEmpty() && node.getPlayer() !== player) {
                    edges.push([`${i}_u`, `${below}`]);
                }
                else if (!this.nodes[below].isEmpty() && this.nodes[below].getPlayer() !== player) {
                    edges.push([`${i}`, `${below}_d`]);
                }
                else {
                    edges.push([`${i}`, `${below}`]);
                }
            }
        }
        const ccs = (0, utils_1.connectedComponents)(new graph_1.default(edges));
        return Math.max(0, ...ccs.map((cc) => this.longestRoadOn(cc)));
    }
    /**
     * Get players who can be robbed.
     * @returns List of player numbers who have structures on nodes incident on
     * the robber tile.
     */
    playersOnRobber() {
        return this.robber !== -1
            ? [
                ...new Set(this.tiles[this.robber].nodes
                    .filter((nid) => !this.nodes[nid].isEmpty())
                    .map((nid) => this.nodes[nid].getPlayer())),
            ]
            : [];
    }
    /**
     * Build a road for player number `player`, if one doesn't already
     * exist, between nodes `nid0` and `nid1`.
     * @param nid0 First node.
     * @param nid1 Second node.
     * @param player The player number.
     */
    buildRoad(nid0, nid1, player) {
        this.roadnetwork.setWeight(nid0, nid1, player);
    }
    /**
     * Get the player number for a road between two nodes.
     * @param nid0 First node.
     * @param nid1 Second node.
     * @returns -1 If no road or if the nodes aren't adjacent. The player number
     * of the road otherwise.
     */
    getRoad(nid0, nid1) {
        return this.roadnetwork.getWeight(nid0, nid1);
    }
}
exports.Board = Board;
exports.default = Board;
//# sourceMappingURL=board.js.map