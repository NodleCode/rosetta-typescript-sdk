import { AccountIdentifier, Amount } from 'types';

// OperationDescription is used to describe an operation
export default class OperationDescription {
    account: AccountIdentifier;
    amount: Amount;
    metadata: any[];
    type: string;
    allow_repeats: boolean;
    optional: boolean;

    constructor({
        account,
        amount,
        metadata = [],
        type = '',
        allow_repeats = false,
        optional = false,
    }) {
        this.account = account;
        this.amount = amount;
        this.metadata = metadata;
        this.type = type;
        this.allow_repeats = allow_repeats;
        this.optional = optional;
    }
}
