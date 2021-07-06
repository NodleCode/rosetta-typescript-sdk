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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var RosettaClient = __importStar(require("rosetta-node-sdk-client"));
var asserter_1 = __importDefault(require("../asserter"));
var exponential_backoff_1 = require("exponential-backoff");
var PromisePool = __importStar(require("../utils/PromisePool"));
var errors_1 = require("../errors");
var Asserter = asserter_1["default"];
var RosettaFetcher = /** @class */ (function () {
    function RosettaFetcher(_a) {
        var _b = _a === void 0 ? {} : _a, apiClient = _b.apiClient, _c = _b.retryOptions, retryOptions = _c === void 0 ? {} : _c, _d = _b.options, options = _d === void 0 ? {} : _d, _e = _b.server, server = _e === void 0 ? {} : _e, _f = _b.asserter, asserter = _f === void 0 ? null : _f;
        this.apiClient = apiClient || this.defaultApiClient(server);
        this.backOffOptions = Object.assign({
            delayFirstAttempt: false,
            jitter: 'none',
            mayDelay: Infinity,
            numOfAttempts: 10,
            retry: function () { return true; },
            startingDelay: 100,
            timeMultiple: 2
        }, retryOptions);
        this.options = Object.assign({
            promisePoolSize: 8
        }, options);
        this.asserter = asserter;
    }
    RosettaFetcher.prototype.initializeAsserter = function () {
        return __awaiter(this, void 0, void 0, function () {
            var networkList, primaryNetwork, networkStatus, networkOptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.asserter) {
                            throw new errors_1.FetcherError('Asserter already initialized');
                        }
                        return [4 /*yield*/, this.networkListRetry()];
                    case 1:
                        networkList = _a.sent();
                        if (networkList.network_identifiers.length == 0) {
                            throw new errors_1.FetcherError('No Networks available');
                        }
                        primaryNetwork = networkList.network_identifiers[0];
                        return [4 /*yield*/, this.networkStatusRetry(primaryNetwork)];
                    case 2:
                        networkStatus = _a.sent();
                        return [4 /*yield*/, this.networkOptionsRetry(primaryNetwork)];
                    case 3:
                        networkOptions = _a.sent();
                        this.asserter = Asserter.NewClientWithResponses(primaryNetwork, networkStatus, networkOptions);
                        return [2 /*return*/, {
                                primaryNetwork: primaryNetwork,
                                networkStatus: networkStatus
                            }];
                }
            });
        });
    };
    RosettaFetcher.prototype.defaultApiClient = function (options) {
        var apiClient = new RosettaClient.ApiClient();
        var _a = options.protocol, protocol = _a === void 0 ? 'http' : _a, _b = options.host, host = _b === void 0 ? 'localhost' : _b, _c = options.port, port = _c === void 0 ? 8000 : _c, _d = options.timeout, timeout = _d === void 0 ? 5000 : _d, requestAgent = options.requestAgent, defaultHeaders = options.defaultHeaders;
        apiClient.basePath = protocol + "://" + host + ":" + port;
        apiClient.timeout = timeout;
        apiClient.requestAgent = requestAgent;
        apiClient.defaultHeaders = defaultHeaders;
        return apiClient;
    };
    RosettaFetcher.prototype.accountBalance = function (networkIdentifier, accountIdentifier, partialBlockIdentifier) {
        return __awaiter(this, void 0, void 0, function () {
            var accountApi, accountBalanceRequest, response, block, balances, metadata, coins;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        accountApi = new RosettaClient.promises.AccountApi(this.apiClient);
                        accountBalanceRequest = new RosettaClient.AccountBalanceRequest(networkIdentifier, accountIdentifier, partialBlockIdentifier);
                        return [4 /*yield*/, accountApi.accountBalance(accountBalanceRequest)];
                    case 1:
                        response = _a.sent();
                        block = response.block_identifier;
                        balances = response.balances;
                        metadata = response.metadata;
                        coins = response.coins;
                        // ToDo: assertion
                        return [2 /*return*/, {
                                block: block,
                                balances: balances,
                                metadata: metadata,
                                coins: coins
                            }];
                }
            });
        });
    };
    RosettaFetcher.prototype.accountBalanceRetry = function (networkIdentifier, accountIdentifier, partialBlockIdentifier, retryOptions) {
        if (retryOptions === void 0) { retryOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exponential_backoff_1.backOff(function () {
                            return _this.accountBalance(networkIdentifier, accountIdentifier, partialBlockIdentifier);
                        }, Object.assign({}, this.backOffOptions, retryOptions))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    RosettaFetcher.prototype.block = function (networkIdentifier, blockIdentifier) {
        return __awaiter(this, void 0, void 0, function () {
            var blockApi, blockRequest, blockResponse, transactions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blockApi = new RosettaClient.promises.BlockApi(this.apiClient);
                        blockRequest = new RosettaClient.BlockRequest(networkIdentifier, blockIdentifier);
                        return [4 /*yield*/, blockApi.block(blockRequest)];
                    case 1:
                        blockResponse = _a.sent();
                        if (typeof blockResponse.block.transactions === 'undefined') {
                            delete blockResponse.block.transactions;
                        }
                        if (blockResponse.other_transactions == null || blockResponse.other_transactions.length == 0) {
                            return [2 /*return*/, blockResponse.block];
                        }
                        transactions = this.transactions(networkIdentifier, blockIdentifier, blockResponse.other_transactions);
                        blockResponse.block.transactions = __spreadArray([blockResponse.block.transactions], transactions);
                        return [2 /*return*/, blockResponse.block];
                }
            });
        });
    };
    RosettaFetcher.prototype.transactions = function (networkIdentifier, blockIdentifier, hashes) {
        return __awaiter(this, void 0, void 0, function () {
            var promiseArguments, transactions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promiseArguments = hashes.map(function (otherTx) {
                            return [networkIdentifier, blockIdentifier, otherTx.hash];
                        });
                        return [4 /*yield*/, PromisePool.create(this.options.promisePoolSize, promiseArguments, this.transaction.bind(this), PromisePool.arrayApplier)];
                    case 1:
                        transactions = _a.sent();
                        return [2 /*return*/, transactions];
                }
            });
        });
    };
    RosettaFetcher.prototype.transaction = function (networkIdentifier, blockIdentifier, hash) {
        return __awaiter(this, void 0, void 0, function () {
            var blockApi, transactionIdentifier, blockTransactionRequest, transactionResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blockApi = new RosettaClient.promises.BlockApi(this.apiClient);
                        transactionIdentifier = new RosettaClient.TransactionIdentifier(hash);
                        blockTransactionRequest = new RosettaClient.BlockTransactionRequest(networkIdentifier, blockIdentifier, transactionIdentifier);
                        return [4 /*yield*/, RosettaClient.blockApi.blockTransaction(blockRequest)];
                    case 1:
                        transactionResponse = _a.sent();
                        // ToDo: Client-side type assertion
                        return [2 /*return*/, transactionResponse.transaction];
                }
            });
        });
    };
    RosettaFetcher.prototype.blockRetry = function (networkIdentifier, blockIdentifier, retryOptions) {
        if (retryOptions === void 0) { retryOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exponential_backoff_1.backOff(function () {
                            return _this.block(networkIdentifier, blockIdentifier);
                        }, Object.assign({}, this.backOffOptions, retryOptions))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     * BlockRange fetches blocks from startIndex to endIndex, inclusive.
     * A direct path from startIndex to endIndex may not exist in the response,
     * if called during a re-org. This case must be handled by any callers.
     * @param {NetworkIdentifier} networkIdentifier
     * @param {number} startIndex - index from first block
     * @param {number} endIndex - index from last block
     */
    RosettaFetcher.prototype.blockRange = function (networkIdentifier, startIndex, endIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var ret, promiseArguments, i, partialBlockIdentifier, blocks;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ret = [];
                        promiseArguments = [];
                        for (i = startIndex; i <= endIndex; ++i) {
                            partialBlockIdentifier = RosettaClient.PartialBlockIdentifier.constructFromObject({ index: i });
                            promiseArguments.push([networkIdentifier, partialBlockIdentifier]);
                        }
                        return [4 /*yield*/, PromisePool.create(this.options.promisePoolSize, promiseArguments, this.blockRetry.bind(this), PromisePool.arrayApplier)];
                    case 1:
                        blocks = _a.sent();
                        return [2 /*return*/, blocks];
                }
            });
        });
    };
    RosettaFetcher.prototype.mempool = function (networkIdentifier) {
        return __awaiter(this, void 0, void 0, function () {
            var mempoolApi, mempoolRequest, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mempoolApi = new RosettaClient.promises.MempoolApi(this.apiClient);
                        mempoolRequest = new RosettaClient.MempoolRequest(networkIdentifier);
                        return [4 /*yield*/, mempoolApi.mempoolRequest(mempoolRequest)];
                    case 1:
                        response = _a.sent();
                        if (response.transaction_identifiers == null || response.transaction_identifiers.length == 0) {
                            throw new errors_1.FetcherError('Mempool is empty');
                        }
                        // ToDo: Assertion
                        return [2 /*return*/, response.transaction_identifiers];
                }
            });
        });
    };
    RosettaFetcher.prototype.mempoolTransaction = function (networkIdentifier, transactionIdentifier) {
        return __awaiter(this, void 0, void 0, function () {
            var mempoolApi, mempoolTransactionRequest, response;
            return __generator(this, function (_a) {
                mempoolApi = new RosettaClient.promises.MempoolApi(this.apiClient);
                mempoolTransactionRequest = new RosettaClient.MempoolTransactionRequest(networkIdentifier, transactionIdentifier);
                response = new RosettaClient.MempoolTransaction(mempoolTransactionRequest);
                // ToDo: Type Assertion
                return [2 /*return*/, response.transaction];
            });
        });
    };
    RosettaFetcher.prototype.networkStatus = function (networkIdentifier, metadata) {
        if (metadata === void 0) { metadata = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var networkApi, networkRequest, networkStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        networkApi = new RosettaClient.promises.NetworkApi(this.apiClient);
                        networkRequest = new RosettaClient.NetworkRequest.constructFromObject({
                            network_identifier: networkIdentifier,
                            metadata: metadata
                        });
                        return [4 /*yield*/, networkApi.networkStatus(networkRequest)];
                    case 1:
                        networkStatus = _a.sent();
                        // ToDo: Type Assertion
                        return [2 /*return*/, networkStatus];
                }
            });
        });
    };
    RosettaFetcher.prototype.networkStatusRetry = function (networkIdentifier, metadata, retryOptions) {
        if (metadata === void 0) { metadata = {}; }
        if (retryOptions === void 0) { retryOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exponential_backoff_1.backOff(function () {
                            return _this.networkStatus(networkIdentifier, metadata);
                        }, Object.assign({}, this.backOffOptions, retryOptions))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    RosettaFetcher.prototype.networkList = function (metadata) {
        if (metadata === void 0) { metadata = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var networkApi, metadataRequest, networkList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        networkApi = new RosettaClient.promises.NetworkApi(this.apiClient);
                        metadataRequest = RosettaClient.MetadataRequest.constructFromObject({
                            metadata: metadata
                        });
                        return [4 /*yield*/, networkApi.networkList(metadataRequest)];
                    case 1:
                        networkList = _a.sent();
                        // ToDo: Type Assertion
                        return [2 /*return*/, networkList];
                }
            });
        });
    };
    RosettaFetcher.prototype.networkListRetry = function (metadata, retryOptions) {
        if (metadata === void 0) { metadata = {}; }
        if (retryOptions === void 0) { retryOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exponential_backoff_1.backOff(function () {
                            return _this.networkList(metadata);
                        }, Object.assign({}, this.backOffOptions, retryOptions))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    RosettaFetcher.prototype.networkOptions = function (networkIdentifier, metadata) {
        if (metadata === void 0) { metadata = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var networkApi, networkRequest, networkOptions, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        networkApi = new RosettaClient.promises.NetworkApi(this.apiClient);
                        networkRequest = new RosettaClient.NetworkRequest.constructFromObject({
                            network_identifier: networkIdentifier,
                            metadata: metadata
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, networkApi.networkOptions(networkRequest)];
                    case 2:
                        networkOptions = _a.sent();
                        // ToDo: Type Assertion
                        return [2 /*return*/, networkOptions];
                    case 3:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    RosettaFetcher.prototype.networkOptionsRetry = function (networkIdentifier, metadata, retryOptions) {
        if (metadata === void 0) { metadata = {}; }
        if (retryOptions === void 0) { retryOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var response;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exponential_backoff_1.backOff(function () {
                            return _this.networkOptions(networkIdentifier, metadata);
                        }, Object.assign({}, this.backOffOptions, retryOptions))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    RosettaFetcher.prototype.constructionMetadata = function (networkIdentifier, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var constructionApi, constructionMetadataRequest, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        constructionApi = new RosettaClient.promises.ConstructionApi(this.apiClient);
                        constructionMetadataRequest = new RosettaClient.ConstructionMetadataRequest(networkIdentifier, options);
                        return [4 /*yield*/, constructionApi.constructionMetadata(constructionMetadataRequest)];
                    case 1:
                        response = _a.sent();
                        // ToDo: Client-side Type Assertion
                        return [2 /*return*/, response.metadata];
                }
            });
        });
    };
    RosettaFetcher.prototype.constructionSubmit = function (networkIdentifier, signedTransaction) {
        return __awaiter(this, void 0, void 0, function () {
            var constructionApi, constructionSubmitRequest, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        constructionApi = new RosettaClient.promises.ConstructionApi(this.apiClient);
                        constructionSubmitRequest = new RosettaClient.ConstructionSubmitRequest(networkIdentifier, signedTransaction);
                        return [4 /*yield*/, constructionApi.constructionSubmit(constructionSubmitRequest)];
                    case 1:
                        response = _a.sent();
                        // ToDo: Client-side Type Assertion
                        return [2 /*return*/, {
                                transactionIdentifier: response.transaction_identifier,
                                metadata: response.metadata
                            }];
                }
            });
        });
    };
    RosettaFetcher.prototype.constructionCombine = function (networkIdentifier, unsignedTransaction, signatureArray) {
        return __awaiter(this, void 0, void 0, function () {
            var constructionApi, constructionCombineRequest, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        constructionApi = new RosettaClient.promises.ConstructionApi(this.apiClient);
                        constructionCombineRequest = new RosettaClient.ConstructionCombineRequest(networkIdentifier, unsignedTransaction, signatureArray);
                        return [4 /*yield*/, constructionApi.constructionCombine(constructionCombineRequest)];
                    case 1:
                        response = _a.sent();
                        // ToDo: Client-side Assertions
                        return [2 /*return*/, response.signed_transaction];
                }
            });
        });
    };
    RosettaFetcher.prototype.constructionDerive = function (networkidentifier, publicKey, metadataMap) {
        return __awaiter(this, void 0, void 0, function () {
            var constructionApi, constructionDeriveRequest, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        constructionApi = new RosettaClient.promises.ConstructionApi(this.apiClient);
                        constructionDeriveRequest = new RosettaClient.ConstructionDeriveRequest(networkIdentifier, publicKey, metadataMap);
                        return [4 /*yield*/, constructionApi.constructionDerive(constructionDeriveRequest)];
                    case 1:
                        response = _a.sent();
                        // ToDo: Client-side Assertions
                        return [2 /*return*/, {
                                address: response.address,
                                metadata: response.metadata
                            }];
                }
            });
        });
    };
    RosettaFetcher.prototype.constructionHash = function (networkIdentifier, signedTransaction) {
        return __awaiter(this, void 0, void 0, function () {
            var constructionApi, constructionHashRequest, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        constructionApi = new RosettaClient.promises.ConstructionApi(this.apiClient);
                        constructionHashRequest = new RosettaClient.ConstructionHashRequest(networkIdentifier, signedTransaction);
                        return [4 /*yield*/, constructionApi.constructionDerive(constructionHashRequest)];
                    case 1:
                        response = _a.sent();
                        // ToDo: Client-side Assertions
                        return [2 /*return*/, response.transaction_identifier];
                }
            });
        });
    };
    RosettaFetcher.prototype.constructionParse = function (networkIdentifier, signed, transaction) {
        return __awaiter(this, void 0, void 0, function () {
            var constructionApi, constructionParseRequest, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        constructionApi = new RosettaClient.promises.ConstructionApi(this.apiClient);
                        constructionParseRequest = new RosettaClient.ConstructionParseRequest(networkIdentifier, signed, transaction);
                        return [4 /*yield*/, constructionApi.constructionParse(constructionParseRequest)];
                    case 1:
                        response = _a.sent();
                        // ToDo: Client-side Assertions
                        return [2 /*return*/, {
                                operations: response.address,
                                signers: response.metadata
                            }];
                }
            });
        });
    };
    RosettaFetcher.prototype.constructionPayloads = function (networkIdentifier, operationArray, metadataMap) {
        return __awaiter(this, void 0, void 0, function () {
            var constructionApi, constructionPayloadsRequest, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        constructionApi = new RosettaClient.promises.ConstructionApi(this.apiClient);
                        constructionPayloadsRequest = new RosettaClient.ConstructionPayloadsRequest(networkIdentifier, operationArray);
                        constructionPayloadsRequest.metadata = metadataMap;
                        return [4 /*yield*/, constructionApi.constructionParse(constructionPayloadsRequest)];
                    case 1:
                        response = _a.sent();
                        // ToDo: Client-side Assertions
                        return [2 /*return*/, {
                                unsigned_transaction: response.unsigned_transaction,
                                payloads: response.payloads
                            }];
                }
            });
        });
    };
    RosettaFetcher.prototype.constructionPreprocess = function (networkIdentifier, operationArray, metadataMap) {
        return __awaiter(this, void 0, void 0, function () {
            var constructionApi, constructionPreprocessRequest, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        constructionApi = new RosettaClient.promises.ConstructionApi(this.apiClient);
                        constructionPreprocessRequest = new RosettaClient.ConstructionPreprocessRequest(networkIdentifier, operationArray);
                        constructionPreprocessRequest.metadata = metadataMap;
                        return [4 /*yield*/, constructionApi.constructionParse(constructionPreprocessRequest)];
                    case 1:
                        response = _a.sent();
                        // ToDo: Client-side Assertions
                        return [2 /*return*/, response.options];
                }
            });
        });
    };
    return RosettaFetcher;
}());
exports["default"] = RosettaFetcher;
//export default RosettaFetcher
