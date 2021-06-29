"use strict";
// InputError.js
Object.defineProperty(exports, "__esModule", { value: true });
class InputError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InputError';
    }
}
exports.default = InputError;
