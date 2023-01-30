import Loggable from './loggable';
import ResourceBundle from './resource/resource_bundle';
export declare enum TradeStatus {
    Pending = 0,
    Accept = 1,
    Decline = 2
}
export declare class TradeOffer implements Loggable {
    /** Unique number for the trade offer */
    readonly id: number;
    /** Player number who is making the offer. */
    readonly offerer: number;
    /** What is offered. */
    readonly offer: ResourceBundle;
    /** What is requested in return. */
    readonly request: ResourceBundle;
    /** How each player number views the trade. */
    readonly status: {
        [key: number]: TradeStatus;
    };
    /** Declines needed to automatically close the trade */
    private maxDeclines;
    constructor(id: number, host: number, offerer: number, offer: ResourceBundle, request: ResourceBundle);
    allDeclined: () => boolean;
    toLog: () => string;
}
export default TradeOffer;
