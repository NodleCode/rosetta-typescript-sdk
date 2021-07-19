import * as Client from 'rosetta-node-sdk-client';
import { ParserError } from '../errors';

import { AddValues, Hash, AmountValue, NegateValue } from '../utils';

import {
    AccountDescription,
    AmountDescription,
    Descriptions,
    OperationDescription,
    Sign,
} from '../models';
import {
    AccountIdentifier,
    Amount,
    Block,
    CoinAction,
    CoinChange,
    Currency,
    Operation,
    Operation as OperationType,
    SigningPayload,
    Transaction,
} from 'types';
import { Asserter } from 'index';

const { Operation } = Client;
const ExpectedOppositesLength = 2;

export interface OperationsGroup {
    type: string;
    operations: OperationType[];
    currencies?: Currency[];
    nil_amount_present?: boolean;
}
const EMPTY_OPERATIONS_GROUP: OperationsGroup = {
    type: '',
    operations: [],
    currencies: [],
    nil_amount_present: false,
};

class Match {
    operations: OperationType[];
    amounts: number[];
    constructor({ operations = [], amounts = [] } = {}) {
        this.operations = operations;
        this.amounts = amounts;
    }

    first() {
        if (this.operations.length > 0) {
            return {
                operation: this.operations[0],
                amount: this.amounts[0],
            };
        }

        return { operation: null, amount: null };
    }
}

class RosettaParser {
    asserter: Asserter;
    exemptFunc: any;
    static Match = Match;
    constructor(
        { asserter, exemptFunc } = {
            asserter: new Asserter(),
            exemptFunc: () => {},
        }
    ) {
        this.asserter = asserter;
        this.exemptFunc = exemptFunc;
    }

    skipOperation(operation: OperationType) {
        const status = this.asserter.OperationSuccessful(operation);

        if (!status) {
            return true;
        }

        if (operation.account == null) {
            return true;
        }

        if (operation.amount == null) {
            return true;
        }

        if (this.exemptFunc && this.exemptFunc(operation)) {
            console.log(
                `Skipping excempt operation: ${JSON.stringify(operation)}`
            );
            return true;
        }

        return false;
    }

    balanceChanges(block: Block, blockRemoved: boolean) {
        const balanceChanges = {};

        for (let tx of block.transactions) {
            for (let op of tx.operations) {
                const skip = this.skipOperation(op);
                if (skip) {
                    continue;
                }

                const amount = op.amount;
                let blockIdentifier = block.block_identifier;

                if (blockRemoved) {
                    const negatedValue = NegateValue(amount.value);
                    amount.value = negatedValue;
                    blockIdentifier = block.parent_block_identifier;
                }

                const serializedAccount = Hash(op.account);
                const serializedCurrency = Hash(op.amount.currency);
                const key = `${serializedAccount}/${serializedCurrency}`;

                if (balanceChanges[key] == null) {
                    balanceChanges[key] = {
                        account_identifier: op.account,
                        currency: op.amount.currency,
                        block_identifier: blockIdentifier,
                        difference: amount.value,
                    };
                    continue;
                }

                const val = balanceChanges[key];
                val.difference = AddValues(val.difference, amount.value);
            }
        }

        // Collect all balance changes and return them.
        const changes = [];
        for (let changeId of Object.keys(balanceChanges)) {
            const change = balanceChanges[changeId];
            changes.push(change);
        }

        return changes;
    }

    /**
     * addOperationToGroup adds an Operation to a OperationGroup.
     *
     * @param {OperationsGroup} operationsGroup: Holds operations of a certain type (= destination)
     * @param {Number} destinationIndex
     * @param {[Number]} assignmentsArray
     * @param {Operation} operation: The operation that is going to be added.
     */
    addOperationToGroup(
        operationsGroup: OperationsGroup = EMPTY_OPERATIONS_GROUP,
        destinationIndex: number,
        assignmentsArray: number[] = [],
        operation: OperationType
    ) {
        if (
            operation.type != operationsGroup.type &&
            operationsGroup.type != ''
        ) {
            operationsGroup.type = '';
        }

        // Add the operation
        operationsGroup.operations.push(operation);
        assignmentsArray[operation.operation_identifier.index] =
            destinationIndex;

        if (operation.amount == null) {
            operationsGroup.nil_amount_present = true;
            return;
        }

        operationsGroup.nil_amount_present = false;

        if (
            -1 ==
            operationsGroup.currencies.findIndex(
                (curr) => Hash(curr) == Hash(operation.amount.currency)
            )
        ) {
            operationsGroup.currencies.push(operation.amount.currency);
        }
    }

    /**
     * sortOperationsGroup sorts operations of an operationGroup and returns
     * all sorted operations as an array.
     *
     * @param {Number} operationsCount: Iterate from 0 .. <operationsCount>
     * @param {Map} operationsGroup: Input OperationsGroup, that will be sorted.
     */
    sortOperationsGroup(
        operationsCount: number,
        operationsGroup: OperationsGroup[]
    ) {
        const sliceGroups = [] as OperationsGroup[];

        for (let i = 0; i < operationsCount; ++i) {
            const v = operationsGroup[i];

            if (v == null) {
                continue;
            }

            v.operations.sort((a, b) => {
                return (
                    a.operation_identifier.index - b.operation_identifier.index
                );
            });

            sliceGroups.push(v);
        }

        return sliceGroups;
    }

    /**
     * Derives Operations from an transaction.
     * Must not be called, unless properly validated (asserted for correctness).
     *
     * @param {Transaction} transaction: Input Transaction
     * @return {OperationsGroup} operationsGroup
     */
    groupOperations(transaction: Transaction): OperationsGroup[] {
        const ops = transaction.operations || [];

        const opGroups = [] as OperationsGroup[];
        const opAssignments = new Array(ops.length).fill(0);
        let counter = 0;

        if (ops) {
            for (let i = 0; i < ops.length; ++i) {
                const op = ops[i];

                // Create a new group
                if (
                    !op.related_operations ||
                    op.related_operations.length == 0
                ) {
                    let key = counter++;

                    opGroups[key] = {
                        type: op.type,
                        operations: [Operation.constructFromObject(op)],
                    };

                    if (op.amount != null) {
                        opGroups[key].currencies = [op.amount.currency];
                        opGroups[key].nil_amount_present = false;
                    } else {
                        opGroups[key].currencies = [];
                        opGroups[key].nil_amount_present = true;
                    }

                    opAssignments[i] = key;
                    continue;
                }

                // Find groups to merge
                const groupsToMerge = [];
                for (let relatedOp of op.related_operations || []) {
                    if (
                        !groupsToMerge.includes(opAssignments[relatedOp.index])
                    ) {
                        groupsToMerge.push(opAssignments[relatedOp.index]);
                    }
                }

                // Ensure that they are sorted, so we can merge other groups.
                groupsToMerge.sort();

                const mergedGroupIndex = groupsToMerge[0];
                const mergedGroup = opGroups[mergedGroupIndex];

                this.addOperationToGroup(
                    mergedGroup,
                    mergedGroupIndex,
                    opAssignments,
                    op
                );

                for (let otherGroupIndex of groupsToMerge.slice(1)) {
                    const otherGroup = opGroups[otherGroupIndex];

                    // Add otherGroup ops to mergedGroup
                    for (let otherOp of otherGroup.operations) {
                        this.addOperationToGroup(
                            mergedGroup,
                            mergedGroupIndex,
                            opAssignments,
                            otherOp
                        );
                    }

                    delete opGroups[otherGroupIndex];
                }
            }

            return this.sortOperationsGroup(ops.length, opGroups);
        }

        return this.sortOperationsGroup(0, opGroups);
    }

    coinActionMatch(requiredCoinAction: CoinAction, coinChange: CoinChange) {
        if (!requiredCoinAction || typeof requiredCoinAction !== 'string') {
            return null;
        }

        if (coinChange == null) {
            throw new ParserError(
                `coin change is null but expected ${requiredCoinAction}`
            );
        }

        if (coinChange.coin_action != requiredCoinAction) {
            throw new ParserError(
                `coin change_action is ${coinChange.coin_action} ` +
                    `but expected ${requiredCoinAction}`
            );
        }
    }

    metadataMatch(metadataDescriptionArray: any[], metadataMap: any) {
        if (metadataDescriptionArray.length == 0) {
            return;
        }

        for (let req of metadataDescriptionArray) {
            const val = metadataMap[req.key];

            if (!val) {
                throw new ParserError(`${req.key} not present in metadata`);
            }

            if (typeof val != req.value_kind) {
                throw new ParserError(
                    `${req.key} value is not of type ${req.value_kind}`
                );
            }
        }
    }

    accountMatch(
        accountDescription: AccountDescription,
        accountIdentifier: AccountIdentifier
    ) {
        if (accountDescription == null) {
            return;
        }

        if (accountIdentifier == null) {
            if (accountDescription.exists) {
                throw new ParserError(`Account is missing`);
            }
            return;
        }

        if (accountIdentifier.sub_account == null) {
            if (accountDescription.sub_account_exists) {
                throw new ParserError(`sub_account_identifier is missing`);
            }
            return;
        }

        if (!accountDescription.sub_account_exists) {
            throw new ParserError(`sub_account is populated`);
        }

        if (
            accountDescription.sub_account_address.length > 0 &&
            accountIdentifier.sub_account.address !=
                accountDescription.sub_account_address
        ) {
            throw new ParserError(
                `sub_account_identifier.address is ${accountIdentifier.sub_account.address}` +
                    ` not ${accountDescription.sub_account_address}`
            );
        }

        try {
            this.metadataMatch(
                accountDescription.sub_account_metadata_keys,
                accountIdentifier.sub_account.metadata
            );
        } catch (e) {
            throw new ParserError(
                `${e.message}: account metadata keys mismatch`
            );
        }
    }

    amountMatch(amountDescription: AmountDescription, amount: Amount) {
        if (amountDescription == null) {
            return;
        }

        if (amount == null) {
            if (amountDescription.exists) {
                throw new ParserError(`amount is missing`);
            }

            return;
        }

        if (!amountDescription.exists) {
            throw new ParserError(`amount is populated`);
        }

        if (!amountDescription.sign.match(amount)) {
            throw new ParserError(
                `amount sign of ${
                    amount.value
                } was not ${amountDescription.sign.toString()}`
            );
        }

        if (amountDescription.currency == null) {
            return;
        }

        if (
            amount.currency == null ||
            Hash(amount.currency) != Hash(amountDescription.currency)
        ) {
            throw new ParserError(
                `Currency ${amountDescription.currency} is not ${amount.currency}`
            );
        }
    }

    operationMatch(
        operation: OperationType,
        operationsDescriptionArray: OperationDescription[],
        matchesArray: Match[]
    ) {
        for (let i = 0; i < operationsDescriptionArray.length; ++i) {
            const des = operationsDescriptionArray[i];

            if (matchesArray[i] != null && !des.allow_repeats) continue;
            if (des.type.length > 0 && des.type != operation.type) continue;

            try {
                this.accountMatch(des.account, operation.account);
                this.amountMatch(des.amount, operation.amount);
                this.metadataMatch(des.metadata, operation.metadata);
                this.coinActionMatch(des.coin_action, operation.coin_change);
            } catch (e) {
                continue;
            }

            if (matchesArray[i] == null) {
                matchesArray[i] = new Match();
            }

            if (operation.amount != null) {
                const val = AmountValue(operation.amount);

                matchesArray[i].amounts.push(val);
            } else {
                matchesArray[i].amounts.push(null);
            }

            matchesArray[i].operations.push(operation);
            return true;
        }

        return false;
    }

    equalAmounts(operationsArray: OperationType[]) {
        if (operationsArray.length == 0) {
            throw new ParserError(`cannot check equality of 0 operations`);
        }

        const val = AmountValue(operationsArray[0].amount);

        for (let op of operationsArray) {
            const otherVal = AmountValue(op.amount);

            if (val !== otherVal) {
                throw new ParserError(
                    `${op.amount.value} is not equal to ${operationsArray[0].amount.value}`
                );
            }
        }
    }

    oppositeAmounts(operationA: OperationType, operationB: OperationType) {
        const valA = AmountValue(operationA.amount);
        const valB = AmountValue(operationB.amount);

        if (new Sign(valA).toString() == new Sign(valB).toString()) {
            throw new ParserError(`${valA} and ${valB} have the same sign`);
        }

        if (Math.abs(valA) !== Math.abs(valB)) {
            throw new ParserError(`${valA} and ${valB} are not equal`);
        }
    }

    equalAddresses(operations: OperationType[]) {
        if (operations.length <= 1) {
            throw new ParserError(
                `Cannot check address equality of ${operations.length} operations`
            );
        }

        let base;

        for (let op of operations) {
            if (op.account == null) {
                throw new ParserError(`account is null`);
            }

            if (!base) {
                base = op.account.address;
                continue;
            }

            if (base != op.account.address) {
                throw new ParserError(
                    `${base} is not equal to ${op.account.address}`
                );
            }
        }
    }

    matchIndexValid(matchesArray: Match[], index: number) {
        if (typeof index != 'number') {
            throw new ParserError(`Index must be a number`);
        }

        if (index >= matchesArray.length) {
            throw new ParserError(`Match index ${index} out of range`);
        }

        if (matchesArray[index] == null) {
            throw new ParserError(`Match index ${index} is null`);
        }
    }

    checkOps(
        requests2dArray: any[],
        matchesArray: Match[],
        validCallback: Function
    ) {
        for (let batch of requests2dArray) {
            const ops = [];

            for (let reqIndex of batch) {
                try {
                    this.matchIndexValid(matchesArray, reqIndex);
                } catch (e) {
                    throw new ParserError(
                        `${e.message}: index ${reqIndex} not valid`
                    );
                }
                ops.push(...matchesArray[reqIndex].operations);
            }

            if (typeof validCallback !== 'function') {
                throw new ParserError(`validCallback must be a function`);
            }

            validCallback(ops);
        }
    }

    expectedOperation(
        intentOperation: OperationType,
        observedOperation: OperationType
    ) {
        if (Hash(intentOperation.account) != Hash(observedOperation.account)) {
            throw new ParserError(
                `Intended Account ${intentOperation.account} did not ` +
                    `match observed account ${observedOperation.account}`
            );
        }

        if (Hash(intentOperation.amount) != Hash(observedOperation.amount)) {
            throw new ParserError(
                `Intended amount ${intentOperation.amount} did not ` +
                    `match observed amount ${observedOperation.amount}`
            );
        }

        if (intentOperation.type != observedOperation.type) {
            throw new ParserError(
                `Intended type ${intentOperation.type} did not ` +
                    `match observed type ${observedOperation.type}`
            );
        }
    }

    expectedOperations(
        intentOperations: OperationType[],
        observedOperations: OperationType[],
        errExtra = false,
        confirmSuccess = false
    ) {
        throw new Error('Not implemented');
        /* if (!Array.isArray(intentOperations))
            throw new ParserError('intentOperations must be an array');

        if (!Array.isArray(observedOperations))
            throw new ParserError('observedOperations must be an array');

        const matches = {};
        const failedMatches = [];

        for (let observed of observedOperations) {
            let foundMatch = false;

            for (let i = 0; i < intentOperations.length; ++i) {
                const intent = intentOperations[i];
                if (matches[i] != null) continue;

                try {
                    this.expectedOperation(intent, observed);
                } catch (e) {
                    continue;
                }

                if (confirmSuccess) {
                    try {
                        this.OperationSuccessful(observed);
                    } catch (e) {
                        throw new ParserError(
                            `Unable to check operation success: ${e.message}`
                        );
                    }

                    if (!obsSuccess) {
                        failedMatches.push(observed);
                    }
                }

                matches[i] = true;
                foundMatch = true;
                break;
            }

            if (!foundMatch && errExtra) {
                throw new ParserError(
                    `Found extra operation: ${JSON.stringify(observed)}`
                );
            }
        }

        const missingIntent = [];
        for (let i = 0; i < intentOperations.length; ++i) {
            if (matches[i] == null) missingIntent.push(i);
        }

        if (missingIntent.length > 0) {
            let errMessage = `Could not intent match ${JSON.stringify(
                missingIntent
            )}`;

            if (failedMatches.length > 0) {
                errMessage = `${errMessage}: found matching ops with unsuccessful status: ${errMessage}`;
            }

            throw new ParserError(errMessage);
        } */
    }

    expectedSigners(
        intentSigningPayloadArray: SigningPayload[],
        observedArray: any[]
    ) {
        if (!Array.isArray(intentSigningPayloadArray))
            throw new ParserError('intentSigningPayloadArray must be an array');

        if (!Array.isArray(observedArray))
            throw new ParserError('observedArray must be an array');

        try {
            this.asserter.StringArray('observed signers', observedArray);
        } catch (e) {
            throw new ParserError(`Found duplicate signer: ${e.message}`);
        }

        const intendedSigners = {};
        for (let payload of intentSigningPayloadArray) {
            intendedSigners[payload.address] = true;
        }

        const seenSigners = [];
        const unmatched = [];

        for (let signer of observedArray) {
            if (intendedSigners[signer] == null) {
                unmatched.push(signer);
            } else {
                seenSigners[signer] = true;
            }
        }

        for (let i = 0; i < Object.keys(intendedSigners).length; ++i) {
            if (seenSigners[i] == null) {
                throw new ParserError(
                    `Could not find match for intended signer: ${i}`
                );
            }
        }

        if (unmatched.length != 0) {
            throw new ParserError(
                `Found unexpected signers: ${JSON.stringify(unmatched)}`
            );
        }
    }

    comparisonMatch(descriptions: Descriptions, matchesArray: Match[]) {
        try {
            this.checkOps(
                descriptions.equal_amounts,
                matchesArray,
                this.equalAmounts
            );
        } catch (e) {
            throw new ParserError(
                `${e.message}: operation amounts are not equal`
            );
        }

        try {
            this.checkOps(
                descriptions.equal_addresses,
                matchesArray,
                this.equalAddresses
            );
        } catch (e) {
            throw new ParserError(
                `${e.message}: operation addresses are not equal`
            );
        }

        for (let amountMatch of descriptions.opposite_amounts) {
            if (amountMatch.length != ExpectedOppositesLength) {
                throw new ParserError(
                    `Cannot check opposites of ${amountMatch.length} operations`
                );
            }

            // Compare all possible pairs
            try {
                this.matchIndexValid(matchesArray, amountMatch[0]);
            } catch (e) {
                throw new ParserError(
                    `${e.message}: opposite amounts comparison error`
                );
            }

            try {
                this.matchIndexValid(matchesArray, amountMatch[1]);
            } catch (e) {
                throw new ParserError(
                    `${e.message}: opposite amounts comparison error`
                );
            }

            const match0Ops = matchesArray[amountMatch[0]].operations;
            const match1Ops = matchesArray[amountMatch[1]].operations;

            this.equalAmounts(match0Ops);
            this.equalAmounts(match1Ops);

            this.oppositeAmounts(match0Ops[0], match1Ops[0]);
        }
    }

    MatchOperations(
        descriptions: Descriptions,
        operationsArray: OperationType[]
    ) {
        if (operationsArray.length == 0) {
            throw new ParserError(
                `Unable to match anything to zero operations`
            );
        }

        const operationDescriptions = descriptions.operation_descriptions;
        const matches = new Array(operationDescriptions.length).fill(null);

        if (operationDescriptions.length == 0) {
            throw new ParserError(`No descriptions to match`);
        }

        for (let i = 0; i < operationsArray.length; ++i) {
            const op = operationsArray[i];
            const matchFound = this.operationMatch(
                op,
                operationDescriptions,
                matches
            );

            if (!matchFound && descriptions.err_unmatched) {
                throw new ParserError(
                    `Unable to find match for operation at index ${i}`
                );
            }
        }

        for (let i = 0; i < matches.length; ++i) {
            if (
                matches[i] === null &&
                !descriptions.operation_descriptions[i].optional
            ) {
                throw new ParserError(
                    `Could not find match for description ${i}`
                );
            }
        }

        try {
            this.comparisonMatch(descriptions, matches);
        } catch (e) {
            throw new ParserError(`${e.message}: group descriptions not met`);
        }

        return matches;
    }
}

export default RosettaParser;
