export default class AccountDescription {
    constructor({ exists, sub_account_exists, sub_account_address, sub_account_metadata_keys }: {
        exists?: boolean;
        sub_account_exists?: boolean;
        sub_account_address?: string;
        sub_account_metadata_keys?: any[];
    });
    exists: boolean;
    sub_account_exists: boolean;
    sub_account_address: string;
    sub_account_metadata_keys: any[];
}
