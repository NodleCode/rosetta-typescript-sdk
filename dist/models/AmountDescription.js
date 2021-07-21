"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Sign_1 = __importDefault(require("./Sign"));
var AmountDescription = /** @class */ (function () {
    function AmountDescription(_a) {
        var _b = _a.exists, exists = _b === void 0 ? false : _b, _c = _a.sign, sign = _c === void 0 ? Sign_1["default"].Any : _c, _d = _a.currency, currency = _d === void 0 ? null : _d;
        this.exists = exists;
        this.sign = new Sign_1["default"](sign);
        this.currency = currency;
    }
    return AmountDescription;
}());
exports["default"] = AmountDescription;
