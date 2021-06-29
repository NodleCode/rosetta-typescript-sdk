"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ANY = void 0;
const errors_1 = require("../errors");
const utils_1 = require("../utils");
exports.ANY = '*';
const POSITIVE = '+';
const NEGATIVE = '-';
class Sign {
    constructor(input) {
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
            throw new errors_1.InternalError(`Sign's constructor doesn't allow '${input}'`);
        }
    }
    sign(number) {
        if (typeof number !== 'number') {
            throw new errors_1.InternalError(`n in sign(n) must be a number`);
        }
        if (number > 0)
            return 1;
        if (number < 0)
            return -1;
        return 0;
    }
    match(amount) {
        if (this.type == exports.ANY) {
            return true;
        }
        try {
            const numeric = utils_1.AmountValue(amount);
            if (this.type == NEGATIVE && this.sign(numeric) == -1) {
                return true;
            }
            if (this.type == POSITIVE && this.sign(numeric) == 1) {
                return true;
            }
        }
        catch (e) {
            console.error(`ERROR`, e);
            return false;
        }
    }
    toString() {
        return this.type;
    }
}
Sign.Positive = POSITIVE;
Sign.Negative = NEGATIVE;
Sign.Any = exports.ANY;
exports.default = Sign;
