"use strict";
exports.__esModule = true;
var AccountDescription = /** @class */ (function () {
    function AccountDescription(_a) {
        var _b = _a.exists, exists = _b === void 0 ? false : _b, _c = _a.sub_account_exists, sub_account_exists = _c === void 0 ? false : _c, _d = _a.sub_account_address, sub_account_address = _d === void 0 ? '' : _d, _e = _a.sub_account_metadata_keys, sub_account_metadata_keys = _e === void 0 ? [] : _e;
        this.exists = exists;
        this.sub_account_exists = sub_account_exists;
        this.sub_account_address = sub_account_address;
        this.sub_account_metadata_keys = sub_account_metadata_keys;
    }
    return AccountDescription;
}());
exports["default"] = AccountDescription;
;
