import { CoinAction } from 'types';
import AccountDescription from './AccountDescription';
import AmountDescription from './AmountDescription';
export default class OperationDescription {
    account: AccountDescription;
    amount: AmountDescription;
    metadata: any[];
    type: string;
    allow_repeats: boolean;
    optional: boolean;
    coin_action: CoinAction;
    constructor({ account, amount, metadata, type, allow_repeats, optional, }: {
        account: any;
        amount: any;
        metadata?: any[];
        type?: string;
        allow_repeats?: boolean;
        optional?: boolean;
    });
}
