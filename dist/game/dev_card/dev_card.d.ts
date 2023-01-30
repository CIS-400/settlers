/**
 * DevCard. each maps to a number so it can be used to index dev card bundles.
 */
export declare enum DevCard {
    Knight = 0,
    VictoryPoint = 1,
    YearOfPlenty = 2,
    Monopoly = 3,
    RoadBuilder = 4
}
/**
 * Get the string representation of a dev card.
 * @param c The Dev card.
 * @returns The string representation.
 */
export declare const devCardStr: (c: DevCard) => "Knight" | "Victory Point" | "Year of Plenty" | "Monopoly" | "Road Builder";
export default DevCard;
