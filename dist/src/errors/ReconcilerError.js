"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ReconcilerError.js
class ReconcilerError extends Error {
    constructor(message, type, filename, lineNumber) {
        super(message, filename, lineNumber);
        this.type = type;
        this.name = 'ReconcilerError';
    }
}
exports.default = ReconcilerError;
