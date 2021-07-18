import { AccountIdentifier, Amount, CoinAction } from 'types';
import AccountDescription from './AccountDescription';
import AmountDescription from './AmountDescription';

// OperationDescription is used to describe an operation
export default class OperationDescription {
    account: AccountDescription;
    amount: AmountDescription;
    metadata: any[];
    type: string;
    allow_repeats: boolean;
    optional: boolean;
    coin_action: CoinAction;
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
