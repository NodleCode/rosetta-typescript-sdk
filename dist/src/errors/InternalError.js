"use strict";
// AsserterError.js
Object.defineProperty(exports, "__esModule", { value: true });
class InternalError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InternalError';
    }
}
exports.default = InternalError;
