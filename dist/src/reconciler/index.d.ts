export default RosettaReconciler;
declare class RosettaReconciler {
    static ContainsAccountCurrency(accountCurrencyMap: any, accountCurrency: any): boolean;
    static extractAmount(amountArray: any, currency: any): any;
    constructor(args?: {});
    network: any;
    helper: any;
    handler: any;
    fetcher: any;
    highWaterMark: boolean;
    lookupBalanceByBlock: boolean;
    interestingAccounts: any;
    inactiveQueue: any[];
    seenAccounts: {};
    requiredDepthInactive: number;
    waitToCheckDiff: number;
    waitToCheckDiffSleep: number;
    inactiveFrequency: number;
    changeQueue: any[];
    handleSeenAccounts(seenAccounts: any): {};
    queueChanges(blockIdentifier: any, balanceChangesArray: any): Promise<void>;
    compareBalance(accountIdentifier: any, currency: any, amount: any, blockIdentifier: any): Promise<{
        difference: string;
        cachedBalance: any;
        headIndex: any;
    }>;
    bestBalance(accountIdentifier: any, currency: any, partialBlockIdentifier: any): Promise<{
        block: any;
        value: any;
    }>;
    shouldAttemptInactiveReconciliation(): Promise<{
        shouldAttempt: boolean;
        head: any;
    }>;
    accountReconciliation(accountIdentifier: any, currency: any, amount: any, blockIdentifier: any, isInactive: any): Promise<any>;
    inactiveAccountQueue(isInactive: any, accountCurrency: any, blockIdentifier: any): Promise<void>;
    reconcileActiveAccounts(): Promise<void>;
    reconcileInactiveAccounts(): Promise<void>;
    reconcile(): Promise<void>;
    getCurrencyBalance(fetcher: any, networkIdentifier: any, accountIdentifier: any, currency: any, partialBlockIdentifier: any): Promise<{
        block: any;
        value: any;
    }>;
}
declare namespace RosettaReconciler {
    export { AccountCurrency };
    export { defaults };
}
declare class AccountCurrency {
    constructor(opts: any, ...args: any[]);
    account: any;
    currency: any;
}
declare namespace defaults {
    export const highWaterMark: number;
    export const lookupBalanceByBlock: boolean;
    export const requiredDepthInactive: number;
    export const waitToCheckDiff: number;
    export const waitToCheckDiffSleep: number;
    export { RECONCILIATION_INACTIVE_FREQUENCY_BLOCK_COUNT as inactiveFrequency };
    export const withSeenAccounts: any[];
}
declare const RECONCILIATION_INACTIVE_FREQUENCY_BLOCK_COUNT: 200;
