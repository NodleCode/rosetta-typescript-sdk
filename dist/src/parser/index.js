"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
var Client = __importStar(require("rosetta-node-sdk-client"));
var errors_1 = require("../errors");
var utils_1 = require("../utils");
var models_1 = require("../models");
var index_1 = require("index");
var Operation = Client.Operation;
var ExpectedOppositesLength = 2;
var EMPTY_OPERATIONS_GROUP = {
    type: '',
    operations: [],
    currencies: [],
    nil_amount_present: false
};
var Match = /** @class */ (function () {
    function Match(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.operations, operations = _c === void 0 ? [] : _c, _d = _b.amounts, amounts = _d === void 0 ? [] : _d;
        this.operations = operations;
        this.amounts = amounts;
    }
    Match.prototype.first = function () {
        if (this.operations.length > 0) {
            return {
                operation: this.operations[0],
                amount: this.amounts[0]
            };
        }
        return { operation: null, amount: null };
    };
    return Match;
}());
var RosettaParser = /** @class */ (function () {
    function RosettaParser(_a) {
        var _b = _a === void 0 ? {
            asserter: new index_1.Asserter(),
            exemptFunc: function () { }
        } : _a, asserter = _b.asserter, exemptFunc = _b.exemptFunc;
        this.asserter = asserter;
        this.exemptFunc = exemptFunc;
    }
    RosettaParser.prototype.skipOperation = function (operation) {
        var status = this.asserter.OperationSuccessful(operation);
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
            console.log("Skipping excempt operation: " + JSON.stringify(operation));
            return true;
        }
        return false;
    };
    RosettaParser.prototype.balanceChanges = function (block, blockRemoved) {
        var balanceChanges = {};
        for (var _i = 0, _a = block.transactions; _i < _a.length; _i++) {
            var tx = _a[_i];
            for (var _b = 0, _c = tx.operations; _b < _c.length; _b++) {
                var op = _c[_b];
                var skip = this.skipOperation(op);
                if (skip) {
                    continue;
                }
                var amount = op.amount;
                var blockIdentifier = block.block_identifier;
                if (blockRemoved) {
                    var negatedValue = utils_1.NegateValue(amount.value);
                    amount.value = negatedValue;
                    blockIdentifier = block.parent_block_identifier;
                }
                var serializedAccount = utils_1.Hash(op.account);
                var serializedCurrency = utils_1.Hash(op.amount.currency);
                var key = serializedAccount + "/" + serializedCurrency;
                if (balanceChanges[key] == null) {
                    balanceChanges[key] = {
                        account_identifier: op.account,
                        currency: op.amount.currency,
                        block_identifier: blockIdentifier,
                        difference: amount.value
                    };
                    continue;
                }
                var val = balanceChanges[key];
                val.difference = utils_1.AddValues(val.difference, amount.value);
            }
        }
        // Collect all balance changes and return them.
        var changes = [];
        for (var _d = 0, _e = Object.keys(balanceChanges); _d < _e.length; _d++) {
            var changeId = _e[_d];
            var change = balanceChanges[changeId];
            changes.push(change);
        }
        return changes;
    };
    /**
     * addOperationToGroup adds an Operation to a OperationGroup.
     *
     * @param {OperationsGroup} operationsGroup: Holds operations of a certain type (= destination)
     * @param {Number} destinationIndex
     * @param {[Number]} assignmentsArray
     * @param {Operation} operation: The operation that is going to be added.
     */
    RosettaParser.prototype.addOperationToGroup = function (operationsGroup, destinationIndex, assignmentsArray, operation) {
        if (operationsGroup === void 0) { operationsGroup = EMPTY_OPERATIONS_GROUP; }
        if (assignmentsArray === void 0) { assignmentsArray = []; }
        if (operation.type != operationsGroup.type &&
            operationsGroup.type != '') {
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
        if (-1 ==
            operationsGroup.currencies.findIndex(function (curr) { return utils_1.Hash(curr) == utils_1.Hash(operation.amount.currency); })) {
            operationsGroup.currencies.push(operation.amount.currency);
        }
    };
    /**
     * sortOperationsGroup sorts operations of an operationGroup and returns
     * all sorted operations as an array.
     *
     * @param {Number} operationsCount: Iterate from 0 .. <operationsCount>
     * @param {Map} operationsGroup: Input OperationsGroup, that will be sorted.
     */
    RosettaParser.prototype.sortOperationsGroup = function (operationsCount, operationsGroup) {
        var sliceGroups = [];
        for (var i = 0; i < operationsCount; ++i) {
            var v = operationsGroup[i];
            if (v == null) {
                continue;
            }
            v.operations.sort(function (a, b) {
                return (a.operation_identifier.index - b.operation_identifier.index);
            });
            sliceGroups.push(v);
        }
        return sliceGroups;
    };
    /**
     * Derives Operations from an transaction.
     * Must not be called, unless properly validated (asserted for correctness).
     *
     * @param {Transaction} transaction: Input Transaction
     * @return {OperationsGroup} operationsGroup
     */
    RosettaParser.prototype.groupOperations = function (transaction) {
        var ops = transaction.operations || [];
        var opGroups = [];
        var opAssignments = new Array(ops.length).fill(0);
        var counter = 0;
        if (ops) {
            for (var i = 0; i < ops.length; ++i) {
                var op = ops[i];
                // Create a new group
                if (!op.related_operations ||
                    op.related_operations.length == 0) {
                    var key = counter++;
                    opGroups[key] = {
                        type: op.type,
                        operations: [Operation.constructFromObject(op)]
                    };
                    if (op.amount != null) {
                        opGroups[key].currencies = [op.amount.currency];
                        opGroups[key].nil_amount_present = false;
                    }
                    else {
                        opGroups[key].currencies = [];
                        opGroups[key].nil_amount_present = true;
                    }
                    opAssignments[i] = key;
                    continue;
                }
                // Find groups to merge
                var groupsToMerge = [];
                for (var _i = 0, _a = op.related_operations || []; _i < _a.length; _i++) {
                    var relatedOp = _a[_i];
                    if (!groupsToMerge.includes(opAssignments[relatedOp.index])) {
                        groupsToMerge.push(opAssignments[relatedOp.index]);
                    }
                }
                // Ensure that they are sorted, so we can merge other groups.
                groupsToMerge.sort();
                var mergedGroupIndex = groupsToMerge[0];
                var mergedGroup = opGroups[mergedGroupIndex];
                this.addOperationToGroup(mergedGroup, mergedGroupIndex, opAssignments, op);
                for (var _b = 0, _c = groupsToMerge.slice(1); _b < _c.length; _b++) {
                    var otherGroupIndex = _c[_b];
                    var otherGroup = opGroups[otherGroupIndex];
                    // Add otherGroup ops to mergedGroup
                    for (var _d = 0, _e = otherGroup.operations; _d < _e.length; _d++) {
                        var otherOp = _e[_d];
                        this.addOperationToGroup(mergedGroup, mergedGroupIndex, opAssignments, otherOp);
                    }
                    delete opGroups[otherGroupIndex];
                }
            }
            return this.sortOperationsGroup(ops.length, opGroups);
        }
        return this.sortOperationsGroup(0, opGroups);
    };
    RosettaParser.prototype.coinActionMatch = function (requiredCoinAction, coinChange) {
        if (!requiredCoinAction || typeof requiredCoinAction !== 'string') {
            return null;
        }
        if (coinChange == null) {
            throw new errors_1.ParserError("coin change is null but expected " + requiredCoinAction);
        }
        if (coinChange.coin_action != requiredCoinAction) {
            throw new errors_1.ParserError("coin change_action is " + coinChange.coin_action + " " +
                ("but expected " + requiredCoinAction));
        }
    };
    RosettaParser.prototype.metadataMatch = function (metadataDescriptionArray, metadataMap) {
        if (metadataDescriptionArray.length == 0) {
            return;
        }
        for (var _i = 0, metadataDescriptionArray_1 = metadataDescriptionArray; _i < metadataDescriptionArray_1.length; _i++) {
            var req = metadataDescriptionArray_1[_i];
            var val = metadataMap[req.key];
            if (!val) {
                throw new errors_1.ParserError(req.key + " not present in metadata");
            }
            if (typeof val != req.value_kind) {
                throw new errors_1.ParserError(req.key + " value is not of type " + req.value_kind);
            }
        }
    };
    RosettaParser.prototype.accountMatch = function (accountDescription, accountIdentifier) {
        if (accountDescription == null) {
            return;
        }
        if (accountIdentifier == null) {
            if (accountDescription.exists) {
                throw new errors_1.ParserError("Account is missing");
            }
            return;
        }
        if (accountIdentifier.sub_account == null) {
            if (accountDescription.sub_account_exists) {
                throw new errors_1.ParserError("sub_account_identifier is missing");
            }
            return;
        }
        if (!accountDescription.sub_account_exists) {
            throw new errors_1.ParserError("sub_account is populated");
        }
        if (accountDescription.sub_account_address.length > 0 &&
            accountIdentifier.sub_account.address !=
                accountDescription.sub_account_address) {
            throw new errors_1.ParserError("sub_account_identifier.address is " + accountIdentifier.sub_account.address +
                (" not " + accountDescription.sub_account_address));
        }
        try {
            this.metadataMatch(accountDescription.sub_account_metadata_keys, accountIdentifier.sub_account.metadata);
        }
        catch (e) {
            throw new errors_1.ParserError(e.message + ": account metadata keys mismatch");
        }
    };
    RosettaParser.prototype.amountMatch = function (amountDescription, amount) {
        if (amountDescription == null) {
            return;
        }
        if (amount == null) {
            if (amountDescription.exists) {
                throw new errors_1.ParserError("amount is missing");
            }
            return;
        }
        if (!amountDescription.exists) {
            throw new errors_1.ParserError("amount is populated");
        }
        if (!amountDescription.sign.match(amount)) {
            throw new errors_1.ParserError("amount sign of " + amount.value + " was not " + amountDescription.sign.toString());
        }
        if (amountDescription.currency == null) {
            return;
        }
        if (amount.currency == null ||
            utils_1.Hash(amount.currency) != utils_1.Hash(amountDescription.currency)) {
            throw new errors_1.ParserError("Currency " + amountDescription.currency + " is not " + amount.currency);
        }
    };
    RosettaParser.prototype.operationMatch = function (operation, operationsDescriptionArray, matchesArray) {
        for (var i = 0; i < operationsDescriptionArray.length; ++i) {
            var des = operationsDescriptionArray[i];
            if (matchesArray[i] != null && !des.allow_repeats)
                continue;
            if (des.type.length > 0 && des.type != operation.type)
                continue;
            try {
                this.accountMatch(des.account, operation.account);
                this.amountMatch(des.amount, operation.amount);
                this.metadataMatch(des.metadata, operation.metadata);
                this.coinActionMatch(des.coin_action, operation.coin_change);
            }
            catch (e) {
                continue;
            }
            if (matchesArray[i] == null) {
                matchesArray[i] = new Match();
            }
            if (operation.amount != null) {
                var val = utils_1.AmountValue(operation.amount);
                matchesArray[i].amounts.push(val);
            }
            else {
                matchesArray[i].amounts.push(null);
            }
            matchesArray[i].operations.push(operation);
            return true;
        }
        return false;
    };
    RosettaParser.prototype.equalAmounts = function (operationsArray) {
        if (operationsArray.length == 0) {
            throw new errors_1.ParserError("cannot check equality of 0 operations");
        }
        var val = utils_1.AmountValue(operationsArray[0].amount);
        for (var _i = 0, operationsArray_1 = operationsArray; _i < operationsArray_1.length; _i++) {
            var op = operationsArray_1[_i];
            var otherVal = utils_1.AmountValue(op.amount);
            if (val !== otherVal) {
                throw new errors_1.ParserError(op.amount.value + " is not equal to " + operationsArray[0].amount.value);
            }
        }
    };
    RosettaParser.prototype.oppositeAmounts = function (operationA, operationB) {
        var valA = utils_1.AmountValue(operationA.amount);
        var valB = utils_1.AmountValue(operationB.amount);
        if (new models_1.Sign(valA).toString() == new models_1.Sign(valB).toString()) {
            throw new errors_1.ParserError(valA + " and " + valB + " have the same sign");
        }
        if (Math.abs(valA) !== Math.abs(valB)) {
            throw new errors_1.ParserError(valA + " and " + valB + " are not equal");
        }
    };
    RosettaParser.prototype.equalAddresses = function (operations) {
        if (operations.length <= 1) {
            throw new errors_1.ParserError("Cannot check address equality of " + operations.length + " operations");
        }
        var base;
        for (var _i = 0, operations_1 = operations; _i < operations_1.length; _i++) {
            var op = operations_1[_i];
            if (op.account == null) {
                throw new errors_1.ParserError("account is null");
            }
            if (!base) {
                base = op.account.address;
                continue;
            }
            if (base != op.account.address) {
                throw new errors_1.ParserError(base + " is not equal to " + op.account.address);
            }
        }
    };
    RosettaParser.prototype.matchIndexValid = function (matchesArray, index) {
        if (typeof index != 'number') {
            throw new errors_1.ParserError("Index must be a number");
        }
        if (index >= matchesArray.length) {
            throw new errors_1.ParserError("Match index " + index + " out of range");
        }
        if (matchesArray[index] == null) {
            throw new errors_1.ParserError("Match index " + index + " is null");
        }
    };
    RosettaParser.prototype.checkOps = function (requests2dArray, matchesArray, validCallback) {
        for (var _i = 0, requests2dArray_1 = requests2dArray; _i < requests2dArray_1.length; _i++) {
            var batch = requests2dArray_1[_i];
            var ops = [];
            for (var _a = 0, batch_1 = batch; _a < batch_1.length; _a++) {
                var reqIndex = batch_1[_a];
                try {
                    this.matchIndexValid(matchesArray, reqIndex);
                }
                catch (e) {
                    throw new errors_1.ParserError(e.message + ": index " + reqIndex + " not valid");
                }
                ops.push.apply(ops, matchesArray[reqIndex].operations);
            }
            if (typeof validCallback !== 'function') {
                throw new errors_1.ParserError("validCallback must be a function");
            }
            validCallback(ops);
        }
    };
    RosettaParser.prototype.expectedOperation = function (intentOperation, observedOperation) {
        if (utils_1.Hash(intentOperation.account) != utils_1.Hash(observedOperation.account)) {
            throw new errors_1.ParserError("Intended Account " + intentOperation.account + " did not " +
                ("match observed account " + observedOperation.account));
        }
        if (utils_1.Hash(intentOperation.amount) != utils_1.Hash(observedOperation.amount)) {
            throw new errors_1.ParserError("Intended amount " + intentOperation.amount + " did not " +
                ("match observed amount " + observedOperation.amount));
        }
        if (intentOperation.type != observedOperation.type) {
            throw new errors_1.ParserError("Intended type " + intentOperation.type + " did not " +
                ("match observed type " + observedOperation.type));
        }
    };
    RosettaParser.prototype.expectedOperations = function (intentOperations, observedOperations, errExtra, confirmSuccess) {
        if (errExtra === void 0) { errExtra = false; }
        if (confirmSuccess === void 0) { confirmSuccess = false; }
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
    };
    RosettaParser.prototype.expectedSigners = function (intentSigningPayloadArray, observedArray) {
        if (!Array.isArray(intentSigningPayloadArray))
            throw new errors_1.ParserError('intentSigningPayloadArray must be an array');
        if (!Array.isArray(observedArray))
            throw new errors_1.ParserError('observedArray must be an array');
        try {
            this.asserter.StringArray('observed signers', observedArray);
        }
        catch (e) {
            throw new errors_1.ParserError("Found duplicate signer: " + e.message);
        }
        var intendedSigners = {};
        for (var _i = 0, intentSigningPayloadArray_1 = intentSigningPayloadArray; _i < intentSigningPayloadArray_1.length; _i++) {
            var payload = intentSigningPayloadArray_1[_i];
            intendedSigners[payload.address] = true;
        }
        var seenSigners = [];
        var unmatched = [];
        for (var _a = 0, observedArray_1 = observedArray; _a < observedArray_1.length; _a++) {
            var signer = observedArray_1[_a];
            if (intendedSigners[signer] == null) {
                unmatched.push(signer);
            }
            else {
                seenSigners[signer] = true;
            }
        }
        for (var i = 0; i < Object.keys(intendedSigners).length; ++i) {
            if (seenSigners[i] == null) {
                throw new errors_1.ParserError("Could not find match for intended signer: " + i);
            }
        }
        if (unmatched.length != 0) {
            throw new errors_1.ParserError("Found unexpected signers: " + JSON.stringify(unmatched));
        }
    };
    RosettaParser.prototype.comparisonMatch = function (descriptions, matchesArray) {
        try {
            this.checkOps(descriptions.equal_amounts, matchesArray, this.equalAmounts);
        }
        catch (e) {
            throw new errors_1.ParserError(e.message + ": operation amounts are not equal");
        }
        try {
            this.checkOps(descriptions.equal_addresses, matchesArray, this.equalAddresses);
        }
        catch (e) {
            throw new errors_1.ParserError(e.message + ": operation addresses are not equal");
        }
        for (var _i = 0, _a = descriptions.opposite_amounts; _i < _a.length; _i++) {
            var amountMatch = _a[_i];
            if (amountMatch.length != ExpectedOppositesLength) {
                throw new errors_1.ParserError("Cannot check opposites of " + amountMatch.length + " operations");
            }
            // Compare all possible pairs
            try {
                this.matchIndexValid(matchesArray, amountMatch[0]);
            }
            catch (e) {
                throw new errors_1.ParserError(e.message + ": opposite amounts comparison error");
            }
            try {
                this.matchIndexValid(matchesArray, amountMatch[1]);
            }
            catch (e) {
                throw new errors_1.ParserError(e.message + ": opposite amounts comparison error");
            }
            var match0Ops = matchesArray[amountMatch[0]].operations;
            var match1Ops = matchesArray[amountMatch[1]].operations;
            this.equalAmounts(match0Ops);
            this.equalAmounts(match1Ops);
            this.oppositeAmounts(match0Ops[0], match1Ops[0]);
        }
    };
    RosettaParser.prototype.MatchOperations = function (descriptions, operationsArray) {
        if (operationsArray.length == 0) {
            throw new errors_1.ParserError("Unable to match anything to zero operations");
        }
        var operationDescriptions = descriptions.operation_descriptions;
        var matches = new Array(operationDescriptions.length).fill(null);
        if (operationDescriptions.length == 0) {
            throw new errors_1.ParserError("No descriptions to match");
        }
        for (var i = 0; i < operationsArray.length; ++i) {
            var op = operationsArray[i];
            var matchFound = this.operationMatch(op, operationDescriptions, matches);
            if (!matchFound && descriptions.err_unmatched) {
                throw new errors_1.ParserError("Unable to find match for operation at index " + i);
            }
        }
        for (var i = 0; i < matches.length; ++i) {
            if (matches[i] === null &&
                !descriptions.operation_descriptions[i].optional) {
                throw new errors_1.ParserError("Could not find match for description " + i);
            }
        }
        try {
            this.comparisonMatch(descriptions, matches);
        }
        catch (e) {
            throw new errors_1.ParserError(e.message + ": group descriptions not met");
        }
        return matches;
    };
    RosettaParser.Match = Match;
    return RosettaParser;
}());
exports["default"] = RosettaParser;
