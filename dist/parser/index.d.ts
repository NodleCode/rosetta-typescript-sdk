import { AccountDescription, AmountDescription, Descriptions, OperationDescription } from '../models';
import { AccountIdentifier, Amount, Block, CoinAction, CoinChange, Currency, Operation, Operation as OperationType, SigningPayload, Transaction } from 'types';
import Asserter from '../asserter';
export interface OperationsGroup {
    type: string;
    operations: OperationType[];
    currencies?: Currency[];
    nil_amount_present?: boolean;
}
declare class Match {
    operations: OperationType[];
    amounts: number[];
    constructor({ operations, amounts }?: {
        operations?: any[];
        amounts?: any[];
    });
    first(): {
        operation: Operation;
        amount: number;
    };
}
declare class RosettaParser {
    asserter: Asserter;
    exemptFunc: any;
    static Match: typeof Match;
    constructor({ asserter, exemptFunc }?: {
        asserter: Asserter;
        exemptFunc: () => void;
    });
    skipOperation(operation: OperationType): boolean;
    balanceChanges(block: Block, blockRemoved: boolean): any[];
    /**
     * addOperationToGroup adds an Operation to a OperationGroup.
     *
     * @param {OperationsGroup} operationsGroup: Holds operations of a certain type (= destination)
     * @param {Number} destinationIndex
     * @param {[Number]} assignmentsArray
     * @param {Operation} operation: The operation that is going to be added.
     */
    addOperationToGroup(operationsGroup: OperationsGroup, destinationIndex: number, assignmentsArray: number[], operation: OperationType): void;
    /**
     * sortOperationsGroup sorts operations of an operationGroup and returns
     * all sorted operations as an array.
     *
     * @param {Number} operationsCount: Iterate from 0 .. <operationsCount>
     * @param {Map} operationsGroup: Input OperationsGroup, that will be sorted.
     */
    sortOperationsGroup(operationsCount: number, operationsGroup: OperationsGroup[]): OperationsGroup[];
    /**
     * Derives Operations from an transaction.
     * Must not be called, unless properly validated (asserted for correctness).
     *
     * @param {Transaction} transaction: Input Transaction
     * @return {OperationsGroup} operationsGroup
     */
    groupOperations(transaction: Transaction): OperationsGroup[];
    coinActionMatch(requiredCoinAction: CoinAction, coinChange: CoinChange): any;
    metadataMatch(metadataDescriptionArray: any[], metadataMap: any): void;
    accountMatch(accountDescription: AccountDescription, accountIdentifier: AccountIdentifier): void;
    amountMatch(amountDescription: AmountDescription, amount: Amount): void;
    operationMatch(operation: OperationType, operationsDescriptionArray: OperationDescription[], matchesArray: Match[]): boolean;
    equalAmounts(operationsArray: OperationType[]): void;
    oppositeAmounts(operationA: OperationType, operationB: OperationType): void;
    equalAddresses(operations: OperationType[]): void;
    matchIndexValid(matchesArray: Match[], index: number): void;
    checkOps(requests2dArray: any[], matchesArray: Match[], validCallback: Function): void;
    expectedOperation(intentOperation: OperationType, observedOperation: OperationType): void;
    expectedOperations(intentOperations: OperationType[], observedOperations: OperationType[], errExtra?: boolean, confirmSuccess?: boolean): void;
    expectedSigners(intentSigningPayloadArray: SigningPayload[], observedArray: any[]): void;
    comparisonMatch(descriptions: Descriptions, matchesArray: Match[]): void;
    MatchOperations(descriptions: Descriptions, operationsArray: OperationType[]): any[];
}
export default RosettaParser;
