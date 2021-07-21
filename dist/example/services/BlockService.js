"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.blockTransaction = exports.block = void 0;
var __1 = require("../../../");
var Types = __1.Client;
/* Data API: Block */
/**
 * Get a Block
 * Get a block by its Block Identifier. If transactions are returned in the same call to the node as fetching the block, the response should include these transactions in the Block object. If not, an array of Transaction Identifiers should be returned so /block/transaction fetches can be done to get all transaction information.
 *
 * blockRequest BlockRequest
 * returns BlockResponse
 * */
var block = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var blockRequest, previousBlockIndex_1, blockIdentifier_1, parentBlockIdentifier_1, timestamp_1, transactions_1, block_1, previousBlockIndex, blockIdentifier, parentBlockIdentifier, timestamp, transactionIdentifier, operations, transactions, block, otherTransactions;
    return __generator(this, function (_a) {
        blockRequest = params.blockRequest;
        if (blockRequest.block_identifier.index != 1000) {
            previousBlockIndex_1 = Math.max(0, blockRequest.block_identifier.index - 1);
            blockIdentifier_1 = new Types.BlockIdentifier(blockRequest.block_identifier.index, "block " + blockRequest.block_identifier.index);
            parentBlockIdentifier_1 = new Types.BlockIdentifier(previousBlockIndex_1, "block " + previousBlockIndex_1);
            timestamp_1 = Date.now() - 500000;
            transactions_1 = [];
            block_1 = new Types.Block(blockIdentifier_1, parentBlockIdentifier_1, timestamp_1, transactions_1);
            return [2 /*return*/, new Types.BlockResponse(block_1)];
        }
        previousBlockIndex = Math.max(0, blockRequest.block_identifier.index - 1);
        blockIdentifier = new Types.BlockIdentifier(1000, 'block 1000');
        parentBlockIdentifier = new Types.BlockIdentifier(999, 'block 999');
        timestamp = 1586483189000;
        transactionIdentifier = new Types.TransactionIdentifier('transaction 0');
        operations = [
            Types.Operation.constructFromObject({
                operation_identifier: new Types.OperationIdentifier(0),
                type: 'Transfer',
                status: 'Success',
                account: new Types.AccountIdentifier('account 0'),
                amount: new Types.Amount('-1000', new Types.Currency('ROS', 2))
            }),
            Types.Operation.constructFromObject({
                operation_identifier: new Types.OperationIdentifier(1),
                related_operations: new Types.OperationIdentifier(0),
                type: 'Transfer',
                status: 'Reverted',
                account: new Types.AccountIdentifier('account 1'),
                amount: new Types.Amount('1000', new Types.Currency('ROS', 2))
            }),
        ];
        transactions = [
            new Types.Transaction(transactionIdentifier, operations),
        ];
        block = new Types.Block(blockIdentifier, parentBlockIdentifier, timestamp, transactions);
        otherTransactions = [
            new Types.TransactionIdentifier('transaction 1'),
        ];
        return [2 /*return*/, new Types.BlockResponse(block, otherTransactions)];
    });
}); };
exports.block = block;
/**
 * Get a Block Transaction
 * Get a transaction in a block by its Transaction Identifier. This endpoint should only be used when querying a node for a block does not return all transactions contained within it.  All transactions returned by this endpoint must be appended to any transactions returned by the /block method by consumers of this data. Fetching a transaction by hash is considered an Explorer Method (which is classified under the Future Work section).  Calling this endpoint requires reference to a BlockIdentifier because transaction parsing can change depending on which block contains the transaction. For example, in Bitcoin it is necessary to know which block contains a transaction to determine the destination of fee payments. Without specifying a block identifier, the node would have to infer which block to use (which could change during a re-org).  Implementations that require fetching previous transactions to populate the response (ex: Previous UTXOs in Bitcoin) may find it useful to run a cache within the Rosetta server in the /data directory (on a path that does not conflict with the node).
 *
 * blockTransactionRequest BlockTransactionRequest
 * returns BlockTransactionResponse
 * */
var blockTransaction = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var blockTransactionRequest, transactionIdentifier, operations;
    return __generator(this, function (_a) {
        blockTransactionRequest = params.blockTransactionRequest;
        transactionIdentifier = new Types.TransactionIdentifier('transaction 1');
        operations = [
            Types.Operation.constructFromObject({
                operation_identifier: new Types.OperationIdentifier(0),
                type: 'Reward',
                status: 'Success',
                account: new Types.AccountIdentifier('account 2'),
                amount: new Types.Amount('1000', new Types.Currency('ROS', 2))
            }),
        ];
        return [2 /*return*/, new Types.Transaction(transactionIdentifier, operations)];
    });
}); };
exports.blockTransaction = blockTransaction;
