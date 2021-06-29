"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// SyncerError.js
class SyncerError extends Error {
    constructor(message) {
        super(message);
        this.name = 'SyncerError';
    }
}
exports.default = SyncerError;
;
