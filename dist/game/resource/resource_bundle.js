"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceBundle = void 0;
const resource_1 = require("./resource");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
/**
 * A collection of resources.
 */
class ResourceBundle {
    constructor(...args) {
        this.toLog = () => this.bundle.map((amnt, i) => `${(0, resource_1.resStr)(i)}: ${amnt}`).join(', ');
        if (args.length === 0) {
            this.bundle = [...Array(constants_1.NUM_RESOURCE_TYPES)].map(() => 0);
        }
        else if (typeof args[0] === 'number') {
            const [amnt] = args;
            this.bundle = [...Array(constants_1.NUM_RESOURCE_TYPES)].map(() => amnt);
        }
        else {
            const [amnts] = args;
            this.bundle = [...Array(constants_1.NUM_RESOURCE_TYPES)];
            for (let i = 0; i < constants_1.NUM_RESOURCE_TYPES; i++)
                this.bundle[i] = amnts[i];
        }
    }
    /**
     * Determine if `bundle` is a subset of this bundle.
     * @param bundle
     * @returns boolean indicating if `bundle` is a subset.
     */
    has(bundle) {
        for (let i = 0; i < constants_1.NUM_RESOURCE_TYPES; i++) {
            if (this.bundle[i] < bundle.get(i))
                return false;
        }
        return true;
    }
    /**
     *
     * @param resource The resource we want the amount of.
     * @returns The number of resource `resource` in the bundle.
     */
    get(resource) {
        return this.bundle[resource];
    }
    /**
     * Set the amount of a resource to resource.
     * @param resource The resource to set the amount of.
     * @param amnt The amount.
     */
    set(resource, amnt) {
        this.bundle[resource] = amnt;
    }
    add(...args) {
        if (args.length === 1) {
            const [bundle] = args;
            for (let i = 0; i < constants_1.NUM_RESOURCE_TYPES; i++) {
                this.bundle[i] += bundle.get(i);
            }
        }
        else {
            const [resource, amnt] = args;
            this.bundle[resource] += amnt;
        }
    }
    subtract(...args) {
        if (args.length === 1) {
            const [bundle] = args;
            for (let i = 0; i < constants_1.NUM_RESOURCE_TYPES; i++) {
                this.bundle[i] -= bundle.get(i);
            }
        }
        else {
            const [resource, amnt] = args;
            this.add(resource, -1 * amnt);
        }
    }
    /**
     * Make a trade between two bundles.
     * @param fromOffereeBundle What is expected in return from the offeree.
     * @param offereeBundle The offeree's bundle.
     * @param fromOffererBundle What is offered by the offerer.
     * @param offererBundle The offerer's bundle.
     */
    static trade(fromOffereeBundle, offereeBundle, fromOffererBundle, offererBundle) {
        // Give the offeree what is offered from the offerer.
        offereeBundle.add(fromOffererBundle);
        offererBundle.subtract(fromOffererBundle);
        // Give the offerer what was expected in return from the offeree.
        offererBundle.add(fromOffereeBundle);
        offereeBundle.subtract(fromOffereeBundle);
    }
    /**
     * Get the amount of Resource `resource` held by the bundle and set it to 0.
     * @param resource The resource we want to take.
     * @returns The amount of `resource` the bundle had.
     */
    removeAll(resource) {
        const temp = this.bundle[resource];
        this.bundle[resource] = 0;
        return temp;
    }
    /**
     * Remove one resource from the bundle at random.
     * @returns The resource that was randomly removed.
     */
    removeOneAtRandom() {
        const resToRemove = (0, utils_1.weightedRandom)(this.bundle);
        this.bundle[resToRemove]--;
        return resToRemove;
    }
    /**
     *
     * @returns The number of resources in the bundle.
     */
    size() {
        let sum = 0;
        for (let i = 0; i < constants_1.NUM_RESOURCE_TYPES; i++) {
            sum += this.bundle[i];
        }
        return sum;
    }
    /**
     *
     * @returns A boolean indicating if the bundle has no resources.
     */
    isEmpty() {
        return this.size() === 0;
    }
}
exports.ResourceBundle = ResourceBundle;
ResourceBundle.roadCost = new ResourceBundle([1, 1, 0, 0, 0]);
ResourceBundle.settlementCost = new ResourceBundle([1, 1, 0, 1, 1]);
ResourceBundle.cityCost = new ResourceBundle([0, 0, 3, 2, 0]);
ResourceBundle.devCardCost = new ResourceBundle([0, 0, 1, 1, 1]);
exports.default = ResourceBundle;
//# sourceMappingURL=resource_bundle.js.map