import DevCardBundle from './dev_card/dev_card_bundle';
import Loggable from './loggable';
import ResourceBundle from './resource/resource_bundle';
export declare class Player implements Loggable {
    /** The players resources. */
    readonly resources: ResourceBundle;
    /** The rates at which a player can exchange a resource for any with the bank. */
    readonly rates: ResourceBundle;
    /** The players dev cards. */
    readonly devCards: DevCardBundle;
    /** Knights player. */
    knightsPlayed: number;
    /** Number of victory points. */
    victoryPoints: number;
    /** Number of cities that can be built. */
    cities: number;
    /** Number of settlements that can be built.  */
    settlements: number;
    /** Number of roads that can be built. */
    roads: number;
    constructor();
    toLog: () => string;
}
export default Player;
