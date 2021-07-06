export default RosettaParser;
declare class RosettaParser {
    constructor({ asserter, exemptFunc }?: {
        asserter: any;
        exemptFunc: any;
    });
    asserter: any;
    exemptFunc: any;
    skipOperation(operation: any): boolean;
    balanceChanges(block: any, blockRemoved: any): any[];
    /**
     * addOperationToGroup adds an Operation to a OperationGroup.
     *
     * @param {OperationsGroup} operationsGroup: Holds operations of a certain type (= destination)
     * @param {Number} destinationIndex
     * @param {[Number]} assignmentsArray
     * @param {Operation} operation: The operation that is going to be added.
     */
    addOperationToGroup(operationsGroup: any, destinationIndex: number, assignmentsArray: [number], operation: any): void;
    /**
     * sortOperationsGroup sorts operations of an operationGroup and returns
     * all sorted operations as an array.
     *
     * @param {Number} operationsCount: Iterate from 0 .. <operationsCount>
     * @param {Map} operationsGroup: Input OperationsGroup, that will be sorted.
     */
    sortOperationsGroup(operationsCount: number, operationsGroup: Map<any, any>): any[];
    /**
     * Derives Operations from an transaction.
     * Must not be called, unless properly validated (asserted for correctness).
     *
     * @param {Transaction} transaction: Input Transaction
     * @return {OperationsGroup} operationsGroup
     */
    groupOperations(transaction: any): any;
    coinActionMatch(requiredCoinAction: any, coinChange: any): any;
    metadataMatch(metadataDescriptionArray: any, metadataMap: any): void;
    accountMatch(accountDescription: any, accountIdentifier: any): void;
    amountMatch(amountDescription: any, amount: any): void;
    operationMatch(operation: any, operationsDescriptionArray: any, matchesArray: any): boolean;
    equalAmounts(operationsArray: any): void;
    oppositeAmounts(operationA: any, operationB: any): void;
    equalAddresses(operations: any): void;
    matchIndexValid(matchesArray: any, index: any): void;
    checkOps(requests2dArray: any, matchesArray: any, validCallback: any): void;
    expectedOperation(intentOperation: any, observedOperation: any): void;
    expectedOperations(intentOperations: any, observedOperations: any, errExtra?: boolean, confirmSuccess?: boolean): void;
    expectedSigners(intentSigningPayloadArray: any, observedArray: any): void;
    comparisonMatch(descriptions: any, matchesArray: any): void;
    MatchOperations(descriptions: any, operationsArray: any): any[];
}
declare namespace RosettaParser {
    export { Match };
}
declare class Match {
    constructor({ operations, amounts }?: {
        operations?: any[];
        amounts?: any[];
    });
    operations: any[];
    amounts: any[];
    first(): {
        operation: any;
        amount: any;
    };
}
