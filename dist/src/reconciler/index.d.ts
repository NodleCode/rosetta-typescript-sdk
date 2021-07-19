import { NetworkIdentifier } from 'src/models';
import Fetcher from '../fetcher';
import { AccountIdentifier, Amount, BlockIdentifier, Currency, PartialBlockIdentifier } from 'types';
interface ReconcilerConstructor {
    networkIdentifier: NetworkIdentifier;
    helper: any;
    handler: any;
    fetcher: Fetcher;
    interestingAccounts?: any[];
}
declare class RosettaReconciler {
    static AccountCurrency: AccountCurrency;
    static defaults: {
        highWaterMark: number;
        lookupBalanceByBlock: boolean;
        requiredDepthInactive: number;
        waitToCheckDiff: number;
        waitToCheckDiffSleep: number;
        inactiveFrequency: number;
        withSeenAccounts: any[];
    };
    network: any;
    helper: any;
    handler: any;
    fetcher: any;
    highWaterMark: any;
    lookupBalanceByBlock: any;
    interestingAccounts: any;
    inactiveQueue: any;
    seenAccounts: any;
    requiredDepthInactive: any;
    waitToCheckDiff: any;
    waitToCheckDiffSleep: any;
    inactiveFrequency: any;
    changeQueue: any;
    debugLogging: any;
    logger: any;
    constructor(args?: ReconcilerConstructor);
    handleSeenAccounts(seenAccounts: string[] | number[] | object[]): {};
    queueChanges(blockIdentifier: BlockIdentifier, balanceChangesArray: any[]): Promise<void>;
    compareBalance(accountIdentifier: AccountIdentifier, currency: Currency, amount: string, blockIdentifier: BlockIdentifier): Promise<{
        difference: string;
        cachedBalance: any;
        headIndex: any;
    }>;
    bestBalance(accountIdentifier: AccountIdentifier, currency: Currency, partialBlockIdentifier: PartialBlockIdentifier): Promise<{
        block: any;
        value: string;
    }>;
    shouldAttemptInactiveReconciliation(): Promise<{
        shouldAttempt: boolean;
        head: any;
    }>;
    accountReconciliation(accountIdentifier: AccountIdentifier, currency: Currency, amount: string, blockIdentifier: BlockIdentifier, isInactive: boolean): Promise<any>;
    static ContainsAccountCurrency(accountCurrencyMap: Currency[], accountCurrency: Currency): boolean;
    inactiveAccountQueue(isInactive: any, accountCurrency: any, blockIdentifier: any): Promise<void>;
    reconcileActiveAccounts(): Promise<void>;
    reconcileInactiveAccounts(): Promise<void>;
    reconcile(): Promise<void>;
    static extractAmount(amountArray: Amount[], currency: Currency): Amount;
    getCurrencyBalance(fetcher: Fetcher, networkIdentifier: NetworkIdentifier, accountIdentifier: AccountIdentifier, currency: Currency, partialBlockIdentifier: PartialBlockIdentifier): Promise<{
        block: any;
        value: string;
    }>;
}
interface AccountCurrencyObj {
    accountIdentifier: AccountIdentifier;
    currency: Currency;
}
declare class AccountCurrency {
    account: AccountIdentifier;
    currency: Currency;
    constructor(opts: AccountCurrencyObj);
}
export default RosettaReconciler;
