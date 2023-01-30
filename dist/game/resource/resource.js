"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resStr = exports.Resource = void 0;
/**
 * Resources. each maps to a number so it can be used to index resource bundles.
 */
var Resource;
(function (Resource) {
    Resource[Resource["Brick"] = 0] = "Brick";
    Resource[Resource["Lumber"] = 1] = "Lumber";
    Resource[Resource["Ore"] = 2] = "Ore";
    Resource[Resource["Grain"] = 3] = "Grain";
    Resource[Resource["Wool"] = 4] = "Wool";
    Resource[Resource["None"] = 5] = "None";
})(Resource = exports.Resource || (exports.Resource = {}));
/**
 * Get a string representation of a resource.
 * @param res The resource.
 * @returns A string representation of the resource.
 */
const resStr = (res) => {
    switch (res) {
        case Resource.Brick:
            return 'brick';
        case Resource.Lumber:
            return 'lumber';
        case Resource.Ore:
            return 'ore';
        case Resource.Grain:
            return 'grain';
        case Resource.Wool:
            return 'wool';
        default:
            return 'none';
    }
};
exports.resStr = resStr;
exports.default = Resource;
//# sourceMappingURL=resource.js.map