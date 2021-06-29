"use strict";
// Contains a slice of operation descriptions
Object.defineProperty(exports, "__esModule", { value: true });
class Descriptions {
    constructor({ operation_descriptions = [], equal_amounts = [], opposite_amounts = [], equal_addresses = [], err_unmatched = false, }) {
        this.operation_descriptions = operation_descriptions;
        this.equal_amounts = equal_amounts;
        this.opposite_amounts = opposite_amounts;
        this.equal_addresses = equal_addresses;
        this.err_unmatched = err_unmatched;
    }
}
exports.default = Descriptions;
;
