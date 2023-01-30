"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeOffer = exports.TradeStatus = void 0;
const constants_1 = require("./constants");
var TradeStatus;
(function (TradeStatus) {
    TradeStatus[TradeStatus["Pending"] = 0] = "Pending";
    TradeStatus[TradeStatus["Accept"] = 1] = "Accept";
    TradeStatus[TradeStatus["Decline"] = 2] = "Decline";
})(TradeStatus = exports.TradeStatus || (exports.TradeStatus = {}));
class TradeOffer {
    constructor(id, host, offerer, offer, request) {
        this.allDeclined = () => {
            let count = 0;
            for (let status in this.status) {
                if (this.status[status] === TradeStatus.Decline)
                    count++;
            }
            return count === this.maxDeclines;
        };
        this.toLog = () => '';
        const isHost = host === offerer;
        this.id = id;
        this.offerer = offerer;
        this.offer = offer;
        this.request = request;
        this.maxDeclines = isHost ? constants_1.NUM_PLAYERS - 1 : 1;
        if (!isHost) {
            this.status = { [host]: TradeStatus.Pending };
        }
        else {
            this.status = {};
            for (let i = 0; i < constants_1.NUM_PLAYERS; i++) {
                if (i === host)
                    continue;
                this.status[i] = TradeStatus.Pending;
            }
        }
    }
}
exports.TradeOffer = TradeOffer;
exports.default = TradeOffer;
//# sourceMappingURL=trade_offer.js.map