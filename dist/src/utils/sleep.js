"use strict";
exports.__esModule = true;
function default_1(timeoutMs) {
    return new Promise(function (fulfill, _) {
        setTimeout(fulfill, timeoutMs);
    });
}
exports["default"] = default_1;
