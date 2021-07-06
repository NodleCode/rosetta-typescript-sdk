"use strict";
exports.__esModule = true;
// OperationDescription is used to describe an operation
var OperationDescription = /** @class */ (function () {
    function OperationDescription(_a) {
        var account = _a.account, amount = _a.amount, _b = _a.metadata, metadata = _b === void 0 ? [] : _b, _c = _a.type, type = _c === void 0 ? '' : _c, _d = _a.allow_repeats, allow_repeats = _d === void 0 ? false : _d, _e = _a.optional, optional = _e === void 0 ? false : _e;
        this.account = account;
        this.amount = amount;
        this.metadata = metadata;
        this.type = type;
        this.allow_repeats = allow_repeats;
        this.optional = optional;
    }
    return OperationDescription;
}());
exports["default"] = OperationDescription;
;
