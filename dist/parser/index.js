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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Client = __importStar(require("rosetta-node-sdk-client"));
var errors_1 = require("../errors");
var utils_1 = require("../utils");
var models_1 = require("../models");
var asserter_1 = __importDefault(require("../asserter"));
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
            asserter: new asserter_1["default"](),
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
        var e_1, _a, e_2, _b, e_3, _c;
        var balanceChanges = {};
        try {
            for (var _d = __values(block.transactions), _e = _d.next(); !_e.done; _e = _d.next()) {
                var tx = _e.value;
                try {
                    for (var _f = (e_2 = void 0, __values(tx.operations)), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var op = _g.value;
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
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_b = _f["return"])) _b.call(_f);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d["return"])) _a.call(_d);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // Collect all balance changes and return them.
        var changes = [];
        try {
            for (var _h = __values(Object.keys(balanceChanges)), _j = _h.next(); !_j.done; _j = _h.next()) {
                var changeId = _j.value;
                var change = balanceChanges[changeId];
                changes.push(change);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_j && !_j.done && (_c = _h["return"])) _c.call(_h);
            }
            finally { if (e_3) throw e_3.error; }
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
        var e_4, _a, e_5, _b, e_6, _c;
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
                try {
                    for (var _d = (e_4 = void 0, __values(op.related_operations || [])), _e = _d.next(); !_e.done; _e = _d.next()) {
                        var relatedOp = _e.value;
                        if (!groupsToMerge.includes(opAssignments[relatedOp.index])) {
                            groupsToMerge.push(opAssignments[relatedOp.index]);
                        }
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_e && !_e.done && (_a = _d["return"])) _a.call(_d);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                // Ensure that they are sorted, so we can merge other groups.
                groupsToMerge.sort();
                var mergedGroupIndex = groupsToMerge[0];
                var mergedGroup = opGroups[mergedGroupIndex];
                this.addOperationToGroup(mergedGroup, mergedGroupIndex, opAssignments, op);
                try {
                    for (var _f = (e_5 = void 0, __values(groupsToMerge.slice(1))), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var otherGroupIndex = _g.value;
                        var otherGroup = opGroups[otherGroupIndex];
                        try {
                            // Add otherGroup ops to mergedGroup
                            for (var _h = (e_6 = void 0, __values(otherGroup.operations)), _j = _h.next(); !_j.done; _j = _h.next()) {
                                var otherOp = _j.value;
                                this.addOperationToGroup(mergedGroup, mergedGroupIndex, opAssignments, otherOp);
                            }
                        }
                        catch (e_6_1) { e_6 = { error: e_6_1 }; }
                        finally {
                            try {
                                if (_j && !_j.done && (_c = _h["return"])) _c.call(_h);
                            }
                            finally { if (e_6) throw e_6.error; }
                        }
                        delete opGroups[otherGroupIndex];
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_b = _f["return"])) _b.call(_f);
                    }
                    finally { if (e_5) throw e_5.error; }
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
        var e_7, _a;
        if (metadataDescriptionArray.length == 0) {
            return;
        }
        try {
            for (var metadataDescriptionArray_1 = __values(metadataDescriptionArray), metadataDescriptionArray_1_1 = metadataDescriptionArray_1.next(); !metadataDescriptionArray_1_1.done; metadataDescriptionArray_1_1 = metadataDescriptionArray_1.next()) {
                var req = metadataDescriptionArray_1_1.value;
                var val = metadataMap[req.key];
                if (!val) {
                    throw new errors_1.ParserError(req.key + " not present in metadata");
                }
                if (typeof val != req.value_kind) {
                    throw new errors_1.ParserError(req.key + " value is not of type " + req.value_kind);
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (metadataDescriptionArray_1_1 && !metadataDescriptionArray_1_1.done && (_a = metadataDescriptionArray_1["return"])) _a.call(metadataDescriptionArray_1);
            }
            finally { if (e_7) throw e_7.error; }
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
        var e_8, _a;
        if (operationsArray.length == 0) {
            throw new errors_1.ParserError("cannot check equality of 0 operations");
        }
        var val = utils_1.AmountValue(operationsArray[0].amount);
        try {
            for (var operationsArray_1 = __values(operationsArray), operationsArray_1_1 = operationsArray_1.next(); !operationsArray_1_1.done; operationsArray_1_1 = operationsArray_1.next()) {
                var op = operationsArray_1_1.value;
                var otherVal = utils_1.AmountValue(op.amount);
                if (val !== otherVal) {
                    throw new errors_1.ParserError(op.amount.value + " is not equal to " + operationsArray[0].amount.value);
                }
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (operationsArray_1_1 && !operationsArray_1_1.done && (_a = operationsArray_1["return"])) _a.call(operationsArray_1);
            }
            finally { if (e_8) throw e_8.error; }
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
        var e_9, _a;
        if (operations.length <= 1) {
            throw new errors_1.ParserError("Cannot check address equality of " + operations.length + " operations");
        }
        var base;
        try {
            for (var operations_1 = __values(operations), operations_1_1 = operations_1.next(); !operations_1_1.done; operations_1_1 = operations_1.next()) {
                var op = operations_1_1.value;
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
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (operations_1_1 && !operations_1_1.done && (_a = operations_1["return"])) _a.call(operations_1);
            }
            finally { if (e_9) throw e_9.error; }
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
        var e_10, _a, e_11, _b;
        try {
            for (var requests2dArray_1 = __values(requests2dArray), requests2dArray_1_1 = requests2dArray_1.next(); !requests2dArray_1_1.done; requests2dArray_1_1 = requests2dArray_1.next()) {
                var batch = requests2dArray_1_1.value;
                var ops = [];
                try {
                    for (var batch_1 = (e_11 = void 0, __values(batch)), batch_1_1 = batch_1.next(); !batch_1_1.done; batch_1_1 = batch_1.next()) {
                        var reqIndex = batch_1_1.value;
                        try {
                            this.matchIndexValid(matchesArray, reqIndex);
                        }
                        catch (e) {
                            throw new errors_1.ParserError(e.message + ": index " + reqIndex + " not valid");
                        }
                        ops.push.apply(ops, __spreadArray([], __read(matchesArray[reqIndex].operations)));
                    }
                }
                catch (e_11_1) { e_11 = { error: e_11_1 }; }
                finally {
                    try {
                        if (batch_1_1 && !batch_1_1.done && (_b = batch_1["return"])) _b.call(batch_1);
                    }
                    finally { if (e_11) throw e_11.error; }
                }
                if (typeof validCallback !== 'function') {
                    throw new errors_1.ParserError("validCallback must be a function");
                }
                validCallback(ops);
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (requests2dArray_1_1 && !requests2dArray_1_1.done && (_a = requests2dArray_1["return"])) _a.call(requests2dArray_1);
            }
            finally { if (e_10) throw e_10.error; }
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
        var e_12, _a, e_13, _b;
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
        try {
            for (var intentSigningPayloadArray_1 = __values(intentSigningPayloadArray), intentSigningPayloadArray_1_1 = intentSigningPayloadArray_1.next(); !intentSigningPayloadArray_1_1.done; intentSigningPayloadArray_1_1 = intentSigningPayloadArray_1.next()) {
                var payload = intentSigningPayloadArray_1_1.value;
                intendedSigners[payload.address] = true;
            }
        }
        catch (e_12_1) { e_12 = { error: e_12_1 }; }
        finally {
            try {
                if (intentSigningPayloadArray_1_1 && !intentSigningPayloadArray_1_1.done && (_a = intentSigningPayloadArray_1["return"])) _a.call(intentSigningPayloadArray_1);
            }
            finally { if (e_12) throw e_12.error; }
        }
        var seenSigners = [];
        var unmatched = [];
        try {
            for (var observedArray_1 = __values(observedArray), observedArray_1_1 = observedArray_1.next(); !observedArray_1_1.done; observedArray_1_1 = observedArray_1.next()) {
                var signer = observedArray_1_1.value;
                if (intendedSigners[signer] == null) {
                    unmatched.push(signer);
                }
                else {
                    seenSigners[signer] = true;
                }
            }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (observedArray_1_1 && !observedArray_1_1.done && (_b = observedArray_1["return"])) _b.call(observedArray_1);
            }
            finally { if (e_13) throw e_13.error; }
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
        var e_14, _a;
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
        try {
            for (var _b = __values(descriptions.opposite_amounts), _c = _b.next(); !_c.done; _c = _b.next()) {
                var amountMatch = _c.value;
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
        }
        catch (e_14_1) { e_14 = { error: e_14_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_14) throw e_14.error; }
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
