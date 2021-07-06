"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
var Sign_1 = __importStar(require("./Sign"));
var AmountDescription = /** @class */ (function () {
    function AmountDescription(_a) {
        var _b = _a.exists, exists = _b === void 0 ? false : _b, _c = _a.sign, sign = _c === void 0 ? Sign_1.Any : _c, _d = _a.currency, currency = _d === void 0 ? null : _d;
        this.exists = exists;
        this.sign = new Sign_1["default"](sign);
        this.currency = currency;
    }
    return AmountDescription;
}());
exports["default"] = AmountDescription;
;
