"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(timeoutMs) {
    return new Promise((fulfill, _) => {
        setTimeout(fulfill, timeoutMs);
    });
}
exports.default = default_1;
;
