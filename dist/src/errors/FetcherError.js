"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// FetcherError.js
class FetcherError extends Error {
    constructor(message) {
        super(message);
        this.name = 'FetcherError';
    }
}
exports.default = FetcherError;
;
