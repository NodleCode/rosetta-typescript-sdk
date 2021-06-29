// AccountDescription.js

module.exports = class AccountDescription {
  constructor({
    exists = false,
    sub_account_exists = false,
    sub_account_address = '',
    sub_account_metadata_keys = []
  }) {
    this.exists = exists;
    this.sub_account_exists = sub_account_exists;
    this.sub_account_address = sub_account_address;
    this.sub_account_metadata_keys = sub_account_metadata_keys;
  }
};