"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevCardBundle = void 0;
const dev_card_1 = require("./dev_card");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
/**
 * A collection of devcards.
 */
class DevCardBundle {
    constructor(...args) {
        this.toLog = () => this.bundle.map((amnt, i) => `${(0, dev_card_1.devCardStr)(i)}: ${amnt}`).join(', ');
        if (args.length === 0) {
            this.bundle = [...Array(constants_1.NUM_DEV_CARD_TYPES)].map(() => 0);
        }
        else if (typeof args[0] === 'number') {
            const [amnt] = args;
            this.bundle = [...Array(constants_1.NUM_DEV_CARD_TYPES)].map(() => amnt);
        }
        else {
            const [amnts] = args;
            this.bundle = [...Array(constants_1.NUM_DEV_CARD_TYPES)];
            for (let i = 0; i < constants_1.NUM_DEV_CARD_TYPES; i++)
                this.bundle[i] = amnts[i];
        }
    }
    add(...args) {
        if (typeof args[0] === 'object') {
            const [bundle] = args;
            for (let i = 0; i < constants_1.NUM_DEV_CARD_TYPES; i++) {
                this.bundle[i] += bundle.get(i);
            }
        }
        else {
            const [devCard] = args;
            this.bundle[devCard]++;
        }
    }
    /**
     * Remove a single devcard from the bundle.
     * @param devcard The dev card to remove one of.
     */
    remove(devcard) {
        this.bundle[devcard]--;
    }
    /**
     * Check if we have a dev card
     * @param devcard The dev card to check for.
     * @returns boolean indicating if we have this dev card.
     */
    has(devcard) {
        return this.bundle[devcard] !== 0;
    }
    /**
     *
     * @param devcard The card we want the amount of.
     * @returns The number of card `devcard` in the bundle.
     */
    get(devcard) {
        return this.bundle[devcard];
    }
    /**
     * Pick one devcard from the bundle at random.
     * @returns The devcard that was randomly picked.
     */
    pickOneAtRandom() {
        return (0, utils_1.weightedRandom)(this.bundle);
    }
    /**
     * Empties the bundle.
     */
    empty() {
        this.bundle = [...Array(constants_1.NUM_DEV_CARD_TYPES)].map(() => 0);
    }
    /**
     *
     * @returns The number of devcards in the bundle.
     */
    size() {
        return this.bundle.reduce((acc, curr) => acc + curr);
    }
    /**
     *
     * @returns A boolean indicating if the bundle has no devcards.
     */
    isEmpty() {
        return this.size() === 0;
    }
}
exports.DevCardBundle = DevCardBundle;
exports.default = DevCardBundle;
