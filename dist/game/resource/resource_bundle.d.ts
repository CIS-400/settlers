import Resource from './resource';
import Loggable from '../loggable';
/**
 * A collection of resources.
 */
export declare class ResourceBundle implements Loggable {
    private bundle;
    /**
     * Initializes an empty bundle.
     */
    constructor();
    /**
     * Initialize a bundle with `amnt` of each resource.
     * @param amnt The amount we want of each resource.
     */
    constructor(amnt: number);
    /**
     * Initialize a bundle with `amnt[i]` of resource `i`.
     * @param amnts The amounts we want for each resource.
     */
    constructor(amnts: number[]);
    /**
     * Determine if `bundle` is a subset of this bundle.
     * @param bundle
     * @returns boolean indicating if `bundle` is a subset.
     */
    has(bundle: ResourceBundle): boolean;
    /**
     *
     * @param resource The resource we want the amount of.
     * @returns The number of resource `resource` in the bundle.
     */
    get(resource: Resource): number;
    /**
     * Set the amount of a resource to resource.
     * @param resource The resource to set the amount of.
     * @param amnt The amount.
     */
    set(resource: Resource, amnt: number): void;
    /**
     *
     * @param bundle The bundle we wish to add to this bundle. It is unchanged.
     */
    add(bundle: ResourceBundle): void;
    /**
     *
     * @param resource The resource we with to add to this bundle.
     * @param amnt The amount of the resource we wish to add.
     */
    add(resource: Resource, amnt: number): void;
    /**
     *
     * @param bundle The bundle we with to subtract from this bundle. It is unchanged.
     */
    subtract(bundle: ResourceBundle): void;
    subtract(resource: Resource, amnt: number): void;
    /**
     * Make a trade between two bundles.
     * @param fromOffereeBundle What is expected in return from the offeree.
     * @param offereeBundle The offeree's bundle.
     * @param fromOffererBundle What is offered by the offerer.
     * @param offererBundle The offerer's bundle.
     */
    static trade(fromOffereeBundle: ResourceBundle, offereeBundle: ResourceBundle, fromOffererBundle: ResourceBundle, offererBundle: ResourceBundle): void;
    /**
     * Get the amount of Resource `resource` held by the bundle and set it to 0.
     * @param resource The resource we want to take.
     * @returns The amount of `resource` the bundle had.
     */
    removeAll(resource: Resource): number;
    /**
     * Remove one resource from the bundle at random.
     * @returns The resource that was randomly removed.
     */
    removeOneAtRandom(): Resource;
    /**
     *
     * @returns The number of resources in the bundle.
     */
    size(): number;
    /**
     *
     * @returns A boolean indicating if the bundle has no resources.
     */
    isEmpty(): boolean;
    static roadCost: ResourceBundle;
    static settlementCost: ResourceBundle;
    static cityCost: ResourceBundle;
    static devCardCost: ResourceBundle;
    toLog: () => string;
}
export default ResourceBundle;
