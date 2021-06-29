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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RosettaClient = __importStar(require("rosetta-node-sdk-client"));
const asserter_1 = __importDefault(require("../asserter"));
const exponential_backoff_1 = require("exponential-backoff");
const PromisePool = __importStar(require("../utils/PromisePool"));
const errors_1 = require("../errors");
const Asserter = asserter_1.default;
class RosettaFetcher {
    constructor({ apiClient, retryOptions = {}, options = {}, server = {}, asserter = null } = {}) {
        this.apiClient = apiClient || this.defaultApiClient(server);
        this.backOffOptions = Object.assign({
            delayFirstAttempt: false,
            jitter: 'none',
            mayDelay: Infinity,
            numOfAttempts: 10,
            retry: () => true,
            startingDelay: 100,
            timeMultiple: 2,
        }, retryOptions);
        this.options = Object.assign({
            promisePoolSize: 8,
        }, options);
        this.asserter = asserter;
    }
    async initializeAsserter() {
        if (this.asserter) {
            throw new errors_1.FetcherError('Asserter already initialized');
        }
        const networkList = await this.networkListRetry();
        if (networkList.network_identifiers.length == 0) {
            throw new errors_1.FetcherError('No Networks available');
        }
        const primaryNetwork = networkList.network_identifiers[0];
        const networkStatus = await this.networkStatusRetry(primaryNetwork);
        const networkOptions = await this.networkOptionsRetry(primaryNetwork);
        this.asserter = Asserter.NewClientWithResponses(primaryNetwork, networkStatus, networkOptions);
        return {
            primaryNetwork,
            networkStatus,
        };
    }
    defaultApiClient(options) {
        const apiClient = new RosettaClient.ApiClient();
        const { protocol = 'http', host = 'localhost', port = 8000, timeout = 5000, requestAgent, defaultHeaders, } = options;
        apiClient.basePath = `${protocol}://${host}:${port}`;
        apiClient.timeout = timeout;
        apiClient.requestAgent = requestAgent;
        apiClient.defaultHeaders = defaultHeaders;
        return apiClient;
    }
    async accountBalance(networkIdentifier, accountIdentifier, partialBlockIdentifier) {
        const accountApi = new RosettaClient.promises.AccountApi(this.apiClient);
        const accountBalanceRequest = new RosettaClient.AccountBalanceRequest(networkIdentifier, accountIdentifier, partialBlockIdentifier);
        const response = await accountApi.accountBalance(accountBalanceRequest);
        const block = response.block_identifier;
        const balances = response.balances;
        const metadata = response.metadata;
        const coins = response.coins;
        // ToDo: assertion
        return {
            block: block,
            balances: balances,
            metadata: metadata,
            coins: coins,
        };
    }
    async accountBalanceRetry(networkIdentifier, accountIdentifier, partialBlockIdentifier, retryOptions = {}) {
        const response = await exponential_backoff_1.backOff(() => this.accountBalance(networkIdentifier, accountIdentifier, partialBlockIdentifier), Object.assign({}, this.backOffOptions, retryOptions));
        return response;
    }
    async block(networkIdentifier, blockIdentifier) {
        const blockApi = new RosettaClient.promises.BlockApi(this.apiClient);
        const blockRequest = new RosettaClient.BlockRequest(networkIdentifier, blockIdentifier);
        const blockResponse = await blockApi.block(blockRequest);
        if (typeof blockResponse.block.transactions === 'undefined') {
            delete blockResponse.block.transactions;
        }
        if (blockResponse.other_transactions == null || blockResponse.other_transactions.length == 0) {
            return blockResponse.block;
        }
        const transactions = this.transactions(networkIdentifier, blockIdentifier, blockResponse.other_transactions);
        blockResponse.block.transactions = [blockResponse.block.transactions, ...transactions];
        return blockResponse.block;
    }
    async transactions(networkIdentifier, blockIdentifier, hashes) {
        // Resolve other transactions
        const promiseArguments = hashes.map((otherTx) => {
            return [networkIdentifier, blockIdentifier, otherTx.hash];
        });
        // Wait for all transactions to be fetched
        const transactions = await PromisePool.create(this.options.promisePoolSize, promiseArguments, this.transaction.bind(this), PromisePool.arrayApplier);
        return transactions;
    }
    async transaction(networkIdentifier, blockIdentifier, hash) {
        const blockApi = new RosettaClient.promises.BlockApi(this.apiClient);
        const transactionIdentifier = new RosettaClient.TransactionIdentifier(hash);
        const blockTransactionRequest = new RosettaClient.BlockTransactionRequest(networkIdentifier, blockIdentifier, transactionIdentifier);
        const transactionResponse = await RosettaClient.blockApi.blockTransaction(blockRequest);
        // ToDo: Client-side type assertion
        return transactionResponse.transaction;
    }
    async blockRetry(networkIdentifier, blockIdentifier, retryOptions = {}) {
        const response = await exponential_backoff_1.backOff(() => this.block(networkIdentifier, blockIdentifier), Object.assign({}, this.backOffOptions, retryOptions));
        return response;
    }
    /**
     * BlockRange fetches blocks from startIndex to endIndex, inclusive.
     * A direct path from startIndex to endIndex may not exist in the response,
     * if called during a re-org. This case must be handled by any callers.
     * @param {NetworkIdentifier} networkIdentifier
     * @param {number} startIndex - index from first block
     * @param {number} endIndex - index from last block
     */
    async blockRange(networkIdentifier, startIndex, endIndex) {
        const ret = [];
        const promiseArguments = [];
        for (let i = startIndex; i <= endIndex; ++i) {
            const partialBlockIdentifier = RosettaClient.PartialBlockIdentifier.constructFromObject({ index: i });
            promiseArguments.push([networkIdentifier, partialBlockIdentifier]);
        }
        // Wait for all blocks to be fetched
        const blocks = await PromisePool.create(this.options.promisePoolSize, promiseArguments, this.blockRetry.bind(this), PromisePool.arrayApplier);
        return blocks;
    }
    async mempool(networkIdentifier) {
        const mempoolApi = new RosettaClient.promises.MempoolApi(this.apiClient);
        const mempoolRequest = new RosettaClient.MempoolRequest(networkIdentifier);
        const response = await mempoolApi.mempoolRequest(mempoolRequest);
        if (response.transaction_identifiers == null || response.transaction_identifiers.length == 0) {
            throw new errors_1.FetcherError('Mempool is empty');
        }
        // ToDo: Assertion
        return response.transaction_identifiers;
    }
    async mempoolTransaction(networkIdentifier, transactionIdentifier) {
        const mempoolApi = new RosettaClient.promises.MempoolApi(this.apiClient);
        const mempoolTransactionRequest = new RosettaClient.MempoolTransactionRequest(networkIdentifier, transactionIdentifier);
        const response = new RosettaClient.MempoolTransaction(mempoolTransactionRequest);
        // ToDo: Type Assertion
        return response.transaction;
    }
    async networkStatus(networkIdentifier, metadata = {}) {
        const networkApi = new RosettaClient.promises.NetworkApi(this.apiClient);
        const networkRequest = new RosettaClient.NetworkRequest.constructFromObject({
            network_identifier: networkIdentifier,
            metadata: metadata,
        });
        const networkStatus = await networkApi.networkStatus(networkRequest);
        // ToDo: Type Assertion
        return networkStatus;
    }
    async networkStatusRetry(networkIdentifier, metadata = {}, retryOptions = {}) {
        const response = await exponential_backoff_1.backOff(() => this.networkStatus(networkIdentifier, metadata), Object.assign({}, this.backOffOptions, retryOptions));
        return response;
    }
    async networkList(metadata = {}) {
        const networkApi = new RosettaClient.promises.NetworkApi(this.apiClient);
        const metadataRequest = RosettaClient.MetadataRequest.constructFromObject({
            metadata,
        });
        const networkList = await networkApi.networkList(metadataRequest);
        // ToDo: Type Assertion
        return networkList;
    }
    async networkListRetry(metadata = {}, retryOptions = {}) {
        const response = await exponential_backoff_1.backOff(() => this.networkList(metadata), Object.assign({}, this.backOffOptions, retryOptions));
        return response;
    }
    async networkOptions(networkIdentifier, metadata = {}) {
        const networkApi = new RosettaClient.promises.NetworkApi(this.apiClient);
        const networkRequest = new RosettaClient.NetworkRequest.constructFromObject({
            network_identifier: networkIdentifier,
            metadata,
        });
        try {
            const networkOptions = await networkApi.networkOptions(networkRequest);
            // ToDo: Type Assertion
            return networkOptions;
        }
        catch (e) {
            console.error(e);
        }
    }
    async networkOptionsRetry(networkIdentifier, metadata = {}, retryOptions = {}) {
        const response = await exponential_backoff_1.backOff(() => this.networkOptions(networkIdentifier, metadata), Object.assign({}, this.backOffOptions, retryOptions));
        return response;
    }
    async constructionMetadata(networkIdentifier, options = {}) {
        const constructionApi = new RosettaClient.promises.ConstructionApi(this.apiClient);
        const constructionMetadataRequest = new RosettaClient.ConstructionMetadataRequest(networkIdentifier, options);
        const response = await constructionApi.constructionMetadata(constructionMetadataRequest);
        // ToDo: Client-side Type Assertion
        return response.metadata;
    }
    async constructionSubmit(networkIdentifier, signedTransaction) {
        const constructionApi = new RosettaClient.promises.ConstructionApi(this.apiClient);
        const constructionSubmitRequest = new RosettaClient.ConstructionSubmitRequest(networkIdentifier, signedTransaction);
        const response = await constructionApi.constructionSubmit(constructionSubmitRequest);
        // ToDo: Client-side Type Assertion
        return {
            transactionIdentifier: response.transaction_identifier,
            metadata: response.metadata,
        };
    }
    async constructionCombine(networkIdentifier, unsignedTransaction, signatureArray) {
        const constructionApi = new RosettaClient.promises.ConstructionApi(this.apiClient);
        const constructionCombineRequest = new RosettaClient.ConstructionCombineRequest(networkIdentifier, unsignedTransaction, signatureArray);
        const response = await constructionApi.constructionCombine(constructionCombineRequest);
        // ToDo: Client-side Assertions
        return response.signed_transaction;
    }
    async constructionDerive(networkidentifier, publicKey, metadataMap) {
        const constructionApi = new RosettaClient.promises.ConstructionApi(this.apiClient);
        const constructionDeriveRequest = new RosettaClient.ConstructionDeriveRequest(networkIdentifier, publicKey, metadataMap);
        const response = await constructionApi.constructionDerive(constructionDeriveRequest);
        // ToDo: Client-side Assertions
        return {
            address: response.address,
            metadata: response.metadata,
        };
    }
    async constructionHash(networkIdentifier, signedTransaction) {
        const constructionApi = new RosettaClient.promises.ConstructionApi(this.apiClient);
        const constructionHashRequest = new RosettaClient.ConstructionHashRequest(networkIdentifier, signedTransaction);
        const response = await constructionApi.constructionDerive(constructionHashRequest);
        // ToDo: Client-side Assertions
        return response.transaction_identifier;
    }
    async constructionParse(networkIdentifier, signed, transaction) {
        const constructionApi = new RosettaClient.promises.ConstructionApi(this.apiClient);
        const constructionParseRequest = new RosettaClient.ConstructionParseRequest(networkIdentifier, signed, transaction);
        const response = await constructionApi.constructionParse(constructionParseRequest);
        // ToDo: Client-side Assertions
        return {
            operations: response.address,
            signers: response.metadata,
        };
    }
    async constructionPayloads(networkIdentifier, operationArray, metadataMap) {
        const constructionApi = new RosettaClient.promises.ConstructionApi(this.apiClient);
        const constructionPayloadsRequest = new RosettaClient.ConstructionPayloadsRequest(networkIdentifier, operationArray);
        constructionPayloadsRequest.metadata = metadataMap;
        const response = await constructionApi.constructionParse(constructionPayloadsRequest);
        // ToDo: Client-side Assertions
        return {
            unsigned_transaction: response.unsigned_transaction,
            payloads: response.payloads,
        };
    }
    async constructionPreprocess(networkIdentifier, operationArray, metadataMap) {
        const constructionApi = new RosettaClient.promises.ConstructionApi(this.apiClient);
        const constructionPreprocessRequest = new RosettaClient.ConstructionPreprocessRequest(networkIdentifier, operationArray);
        constructionPreprocessRequest.metadata = metadataMap;
        const response = await constructionApi.constructionParse(constructionPreprocessRequest);
        // ToDo: Client-side Assertions
        return response.options;
    }
}
exports.default = RosettaFetcher;
//export default RosettaFetcher
