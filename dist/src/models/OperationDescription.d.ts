import { AccountIdentifier, Amount } from 'types';
export default class OperationDescription {
    account: AccountIdentifier;
    amount: Amount;
    metadata: any[];
    type: string;
    allow_repeats: boolean;
    optional: boolean;
    constructor({ account, amount, metadata, type, allow_repeats, optional, }: {
        account: any;
        amount: any;
        metadata?: any[];
        type?: string;
        allow_repeats?: boolean;
        optional?: boolean;
    });
}
