"use strict";
exports.__esModule = true;
exports.ANY = void 0;
var errors_1 = require("../errors");
var utils_1 = require("../utils");
exports.ANY = '*';
var POSITIVE = '+';
var NEGATIVE = '-';
var Sign = /** @class */ (function () {
    function Sign(input) {
        if ([exports.ANY, POSITIVE, NEGATIVE].includes(input)) {
            this.type = input;
        }
        else if (typeof input == 'number') {
            switch (this.sign(input)) {
                case -1:
                    this.type = NEGATIVE;
                    break;
                case +1:
                    this.type = POSITIVE;
                    break;
                case 0:
                    this.type = POSITIVE;
                    break;
            }
        }
        else {
            throw new errors_1.InternalError("Sign's constructor doesn't allow '" + input + "'");
        }
    }
    Sign.prototype.sign = function (number) {
        if (typeof number !== 'number') {
            throw new errors_1.InternalError("n in sign(n) must be a number");
        }
        if (number > 0)
            return 1;
        if (number < 0)
            return -1;
        return 0;
    };
    Sign.prototype.match = function (amount) {
        if (this.type == exports.ANY) {
            return true;
        }
        try {
            var numeric = utils_1.AmountValue(amount);
            if (this.type == NEGATIVE && this.sign(numeric) == -1) {
                return true;
            }
            if (this.type == POSITIVE && this.sign(numeric) == 1) {
                return true;
            }
        }
        catch (e) {
            console.error("ERROR", e);
            return false;
        }
    };
    Sign.prototype.toString = function () {
        return this.type;
    };
    Sign.Positive = POSITIVE;
    Sign.Negative = NEGATIVE;
    Sign.Any = exports.ANY;
    return Sign;
}());
exports["default"] = Sign;
