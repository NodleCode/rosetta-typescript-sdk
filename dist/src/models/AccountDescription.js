"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AccountDescription {
    constructor({ exists = false, sub_account_exists = false, sub_account_address = '', sub_account_metadata_keys = [] }) {
        this.exists = exists;
        this.sub_account_exists = sub_account_exists;
        this.sub_account_address = sub_account_address;
        this.sub_account_metadata_keys = sub_account_metadata_keys;
    }
}
exports.default = AccountDescription;
;
