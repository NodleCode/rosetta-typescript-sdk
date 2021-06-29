"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ParserError.js
class ParserError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ParserError';
    }
}
exports.default = ParserError;
;
