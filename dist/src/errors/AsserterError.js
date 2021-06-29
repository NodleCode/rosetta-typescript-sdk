"use strict";
// AsserterError.js
Object.defineProperty(exports, "__esModule", { value: true });
class AsserterError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AsserterError';
    }
}
exports.default = AsserterError;
