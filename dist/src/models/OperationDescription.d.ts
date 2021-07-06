export default class OperationDescription {
    constructor({ account, amount, metadata, type, allow_repeats, optional, }: {
        account: any;
        amount: any;
        metadata?: any[];
        type?: string;
        allow_repeats?: boolean;
        optional?: boolean;
    });
    account: any;
    amount: any;
    metadata: any[];
    type: string;
    allow_repeats: boolean;
    optional: boolean;
}
