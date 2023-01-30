"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devCardStr = exports.DevCard = void 0;
/**
 * DevCard. each maps to a number so it can be used to index dev card bundles.
 */
var DevCard;
(function (DevCard) {
    DevCard[DevCard["Knight"] = 0] = "Knight";
    DevCard[DevCard["VictoryPoint"] = 1] = "VictoryPoint";
    DevCard[DevCard["YearOfPlenty"] = 2] = "YearOfPlenty";
    DevCard[DevCard["Monopoly"] = 3] = "Monopoly";
    DevCard[DevCard["RoadBuilder"] = 4] = "RoadBuilder";
})(DevCard = exports.DevCard || (exports.DevCard = {}));
/**
 * Get the string representation of a dev card.
 * @param c The Dev card.
 * @returns The string representation.
 */
const devCardStr = (c) => {
    switch (c) {
        case DevCard.Knight:
            return 'Knight';
        case DevCard.VictoryPoint:
            return 'Victory Point';
        case DevCard.YearOfPlenty:
            return 'Year of Plenty';
        case DevCard.Monopoly:
            return 'Monopoly';
        default:
            return 'Road Builder';
    }
};
exports.devCardStr = devCardStr;
exports.default = DevCard;
