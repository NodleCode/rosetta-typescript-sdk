export default class AccountDescription {
    exists: boolean;
    sub_account_exists: boolean;
    sub_account_address: string;
    sub_account_metadata_keys: any[];
    constructor({
        exists = false,
        sub_account_exists = false,
        sub_account_address = '',
        sub_account_metadata_keys = [],
    }) {
        this.exists = exists;
        this.sub_account_exists = sub_account_exists;
        this.sub_account_address = sub_account_address;
        this.sub_account_metadata_keys = sub_account_metadata_keys;
    }
}
