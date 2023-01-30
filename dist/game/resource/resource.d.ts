/**
 * Resources. each maps to a number so it can be used to index resource bundles.
 */
export declare enum Resource {
    Brick = 0,
    Lumber = 1,
    Ore = 2,
    Grain = 3,
    Wool = 4,
    None = 5
}
/**
 * Get a string representation of a resource.
 * @param res The resource.
 * @returns A string representation of the resource.
 */
export declare const resStr: (res: Resource) => "brick" | "lumber" | "ore" | "grain" | "wool" | "none";
export default Resource;
