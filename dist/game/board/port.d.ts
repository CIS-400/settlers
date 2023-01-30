import Resource from '../resource/resource';
declare class Port {
    /** List of resources willing to be exchanged at `rate` for one. */
    readonly resources: Resource[];
    /** Takes `rate` of a resource in `resources` in exchange for 1 other resource. */
    readonly rate: number;
    constructor(resources: Resource[], rate: number);
}
export default Port;
