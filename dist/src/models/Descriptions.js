"use strict";
exports.__esModule = true;
var Descriptions = /** @class */ (function () {
    function Descriptions(_a) {
        var _b = _a.operation_descriptions, operation_descriptions = _b === void 0 ? [] : _b, _c = _a.equal_amounts, equal_amounts = _c === void 0 ? [] : _c, _d = _a.opposite_amounts, opposite_amounts = _d === void 0 ? [] : _d, _e = _a.equal_addresses, equal_addresses = _e === void 0 ? [] : _e, _f = _a.err_unmatched, err_unmatched = _f === void 0 ? false : _f;
        this.operation_descriptions = operation_descriptions;
        this.equal_amounts = equal_amounts;
        this.opposite_amounts = opposite_amounts;
        this.equal_addresses = equal_addresses;
        this.err_unmatched = err_unmatched;
    }
    return Descriptions;
}());
exports["default"] = Descriptions;
