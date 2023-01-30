import DevCard from './dev_card';
import Loggable from '../loggable';
/**
 * A collection of devcards.
 */
export declare class DevCardBundle implements Loggable {
    private bundle;
    /**
     * Initializes an empty bundle.
     */
    constructor();
    /**
     * Initialize a bundle with `amnt` of each devcard.
     * @param amnt The amount we want of each devcard.
     */
    constructor(amnt: number);
    /**
     * Initialize a bundle with `amnt[i]` of devcard `i`.
     * @param amnts The amounts we want for each devcard.
     */
    constructor(amnts: number[]);
    /**
     *
     * @param bundle The bundle we wish to add to this bundle. It is unchanged.
     */
    add(bundle: DevCardBundle): void;
    /**
     *
     * @param DevCard The DevCard we with to add one of to this bundle.
     */
    add(DevCard: DevCard): void;
    /**
     * Remove a single devcard from the bundle.
     * @param devcard The dev card to remove one of.
     */
    remove(devcard: DevCard): void;
    /**
     * Check if we have a dev card
     * @param devcard The dev card to check for.
     * @returns boolean indicating if we have this dev card.
     */
    has(devcard: DevCard): boolean;
    /**
     *
     * @param devcard The card we want the amount of.
     * @returns The number of card `devcard` in the bundle.
     */
    get(devcard: DevCard): number;
    /**
     * Pick one devcard from the bundle at random.
     * @returns The devcard that was randomly picked.
     */
    pickOneAtRandom(): DevCard;
    /**
     * Empties the bundle.
     */
    empty(): void;
    /**
     *
     * @returns The number of devcards in the bundle.
     */
    size(): number;
    /**
     *
     * @returns A boolean indicating if the bundle has no devcards.
     */
    isEmpty(): boolean;
    toLog: () => string;
}
export default DevCardBundle;
