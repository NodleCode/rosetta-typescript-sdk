"use strict";
// Reconciler: index.js
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var errors_1 = require("../errors");
var utils_1 = require("../utils");
var Client = __importStar(require("rosetta-node-sdk-client"));
var sleep_1 = __importDefault(require("../utils/sleep"));
var _AccountCurrency = Client.AccountCurrency;
var RECONCILIATION_INACTIVE_SLEEP_MS = 5000;
var RECONCILIATION_INACTIVE_FREQUENCY_BLOCK_COUNT = 200;
var defaults = {
    highWaterMark: -1,
    lookupBalanceByBlock: true,
    requiredDepthInactive: 500,
    waitToCheckDiff: 10 * 1000,
    waitToCheckDiffSleep: 5000,
    inactiveFrequency: RECONCILIATION_INACTIVE_FREQUENCY_BLOCK_COUNT,
    withSeenAccounts: []
};
var RECONCILIATION_ACTIVE = 'ACTIVE';
var RECONCILIATION_INACTIVE = 'INACTIVE';
var RECONCILIATION_ERROR_HEAD_BEHIND_LIVE = 'ERROR_HEAD_BEHIND_LIVE';
var RECONCILIATION_ERROR_ACCOUNT_UPDATED = 'ACCOUNT_UPDATED';
var RECONCILIATION_ERROR_BLOCK_GONE = 'BLOCK_GONE';
var RosettaReconciler = /** @class */ (function () {
    function RosettaReconciler(args) {
        if (args === void 0) { args = {}; }
        var networkIdentifier = args.networkIdentifier, helper = args.helper, handler = args.handler, fetcher = args.fetcher;
        var configuration = Object.assign({}, defaults, args);
        this.network = networkIdentifier;
        this.helper = helper;
        this.handler = handler;
        this.fetcher = fetcher;
        this.highWaterMark = configuration.lookupBalanceByBlock;
        this.lookupBalanceByBlock = configuration.lookupBalanceByBlock;
        this.interestingAccounts = configuration.interestingAccounts || [];
        this.inactiveQueue = [];
        this.seenAccounts = this.handleSeenAccounts(configuration.withSeenAccounts);
        this.requiredDepthInactive = configuration.requiredDepthInactive;
        this.waitToCheckDiff = configuration.waitToCheckDiff;
        this.waitToCheckDiffSleep = configuration.waitToCheckDiffSleep;
        this.inactiveFrequency = configuration.inactiveFrequency;
        this.changeQueue = [];
    }
    RosettaReconciler.prototype.handleSeenAccounts = function (seenAccounts) {
        var _this = this;
        var seen = {};
        seenAccounts.forEach(function (s) {
            _this.inactiveQueue.push({ entry: s });
            seen[utils_1.Hash(s)] = {};
        });
        return seen;
    };
    RosettaReconciler.prototype.queueChanges = function (blockIdentifier, balanceChangesArray) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, account, skipAccount, _b, balanceChangesArray_1, change, _c, balanceChangesArray_2, change;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        for (_i = 0, _a = this.interestingAccounts; _i < _a.length; _i++) {
                            account = _a[_i];
                            skipAccount = false;
                            for (_b = 0, balanceChangesArray_1 = balanceChangesArray; _b < balanceChangesArray_1.length; _b++) {
                                change = balanceChangesArray_1[_b];
                                if (utils_1.Hash(account) == utils_1.Hash(change)) {
                                    skipAccount = true;
                                    break;
                                }
                            }
                            if (skipAccount)
                                continue;
                            balanceChangesArray.push({
                                account_identifier: account.account,
                                currency: account.currency,
                                block_identifier: "0",
                                difference: block
                            });
                        }
                        _c = 0, balanceChangesArray_2 = balanceChangesArray;
                        _d.label = 1;
                    case 1:
                        if (!(_c < balanceChangesArray_2.length)) return [3 /*break*/, 4];
                        change = balanceChangesArray_2[_c];
                        return [4 /*yield*/, this.inactiveAccountQueue(false, new _AccountCurrency(change.account, change.currency), blockIdentifier)];
                    case 2:
                        _d.sent();
                        if (!this.lookupBalanceByBlock) {
                            if (blockIdentifier.index < this.highWaterMark) {
                                return [3 /*break*/, 3];
                            }
                            this.changeQueue.push(change);
                        }
                        else {
                            this.changeQueue.push(change);
                        }
                        _d.label = 3;
                    case 3:
                        _c++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    RosettaReconciler.prototype.compareBalance = function (accountIdentifier, currency, amount, blockIdentifier) {
        return __awaiter(this, void 0, void 0, function () {
            var head, exists, _a, cachedBalance, balanceBlock, difference;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.helper.currentBlock()];
                    case 1:
                        head = _b.sent();
                        if (blockIdentifier.index > head.index) {
                            throw new errors_1.ReconcilerError("Live block " + blockIdentifier.index + " > head block " + head.index, RECONCILIATION_ERROR_HEAD_BEHIND_LIVE);
                        }
                        return [4 /*yield*/, this.helper.blockExists(blockIdentifier)];
                    case 2:
                        exists = _b.sent();
                        if (!exists) {
                            throw new errors_1.ReconcilerError("Block gone! Block hash = " + blockIdentifier.hash, RECONCILIATION_ERROR_BLOCK_GONE);
                        }
                        return [4 /*yield*/, this.helper.accountBalance(accountIdentifier, currency, head)];
                    case 3:
                        _a = _b.sent(), cachedBalance = _a.cachedBalance, balanceBlock = _a.balanceBlock;
                        if (blockIdentifier.index < balanceBlock.index) {
                            throw new errors_1.ReconcilerError("Account updated: " + JSON.stringify(accountIdentifier) + " updated at blockheight " + balanceBlock.index, RECONCILIATION_ERROR_ACCOUNT_UPDATED);
                        }
                        difference = utils_1.SubtractValues(cachedBalance.value, amount);
                        return [2 /*return*/, {
                                difference: difference,
                                cachedBalance: cachedBalance.value,
                                headIndex: head.index
                            }];
                }
            });
        });
    };
    RosettaReconciler.prototype.bestBalance = function (accountIdentifier, currency, partialBlockIdentifier) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.lookupBalanceByBlock) {
                            partialBlockIdentifier = null;
                        }
                        return [4 /*yield*/, this.getCurrencyBalance(this.fetcher, this.network, accountIdentifier, currency, partialBlockIdentifier)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RosettaReconciler.prototype.shouldAttemptInactiveReconciliation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var head, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.helper.currentBlock()];
                    case 1:
                        head = _a.sent();
                        if (head.index < this.highWaterMark) {
                            if (this.debugLogging)
                                this.logger.verbose('Waiting to continue inactive reconciliation until reaching high water mark...');
                            return [2 /*return*/, { shouldAttempt: false, head: null }];
                        }
                        return [2 /*return*/, { shouldAttempt: true, head: head }];
                    case 2:
                        e_1 = _a.sent();
                        if (this.debugLogging)
                            this.logger.verbose('Waiting to start inactive reconciliation until a block is synced...');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, { shouldAttempt: false, head: null }];
                }
            });
        });
    };
    RosettaReconciler.prototype.accountReconciliation = function (accountIdentifier, currency, amount, blockIdentifier, isInactive) {
        return __awaiter(this, void 0, void 0, function () {
            var accountCurrency, difference, cachedBalance, headIndex, result, e_2, _a, diff, reconciliationType, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        accountCurrency = {
                            account_identifier: accountIdentifier,
                            currency: currency
                        };
                        _b.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 19];
                        difference = void 0;
                        cachedBalance = void 0;
                        headIndex = void 0;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 14]);
                        return [4 /*yield*/, this.compareBalance(accountIdentifier, currency, amount, blockIdentifier)];
                    case 3:
                        result = _b.sent();
                        (difference = result.difference, cachedBalance = result.cachedBalance, headIndex = result.headIndex);
                        return [3 /*break*/, 14];
                    case 4:
                        e_2 = _b.sent();
                        if (!(e_2 instanceof errors_1.ReconcilerError)) return [3 /*break*/, 12];
                        _a = e_2.type;
                        switch (_a) {
                            case RECONCILIATION_ERROR_HEAD_BEHIND_LIVE: return [3 /*break*/, 5];
                            case RECONCILIATION_ERROR_ACCOUNT_UPDATED: return [3 /*break*/, 8];
                            case RECONCILIATION_ERROR_BLOCK_GONE: return [3 /*break*/, 9];
                        }
                        return [3 /*break*/, 10];
                    case 5:
                        diff = blockIdentifier.index - headIndex;
                        if (!(diff < this.waitToCheckDiff)) return [3 /*break*/, 7];
                        return [4 /*yield*/, sleep_1["default"](this.waitToCheckDiffSleep)];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 1];
                    case 7:
                        // Don't wait to check if we are very far behind
                        console.info("Skipping reconciliation for " + JSON.stringify(accountCurrency) + ":" +
                            (" " + diff + " blocks behind"));
                        // Set a highWaterMark to not accept any new
                        // reconciliation requests unless they happened
                        // after this new highWaterMark.
                        this.highWaterMark = partialBlockIdentifier.index;
                        return [3 /*break*/, 11];
                    case 8:
                        {
                            // Either the block has not been processed in a re-org yet
                            // or the block was orphaned
                            return [3 /*break*/, 11];
                        }
                        _b.label = 9;
                    case 9:
                        {
                            // If account was updated, it must be
                            // enqueued again
                            return [3 /*break*/, 11];
                        }
                        _b.label = 10;
                    case 10: return [3 /*break*/, 11];
                    case 11: return [3 /*break*/, 13];
                    case 12: throw e_2;
                    case 13: return [3 /*break*/, 14];
                    case 14:
                        reconciliationType = RECONCILIATION_ACTIVE;
                        if (isInactive) {
                            reconciliationType = RECONCILIATION_INACTIVE;
                        }
                        if (!(difference != "0")) return [3 /*break*/, 16];
                        return [4 /*yield*/, this.handler.reconciliationFailed(reconciliationType, accountCurrency.account_identifier, accountCurrency.currency, cachedBalance, amount, blockIdentifier)];
                    case 15:
                        error = _b.sent();
                        if (error)
                            throw error;
                        _b.label = 16;
                    case 16: return [4 /*yield*/, this.inactiveAccountQueue(isInactive, accountCurrency, blockIdentifier)];
                    case 17:
                        _b.sent();
                        return [4 /*yield*/, this.handler.reconciliationSucceeded(reconciliationType, accountCurrency.account_identifier, accountCurrency.currency, amount, blockIdentifier)];
                    case 18: return [2 /*return*/, _b.sent()];
                    case 19: return [2 /*return*/];
                }
            });
        });
    };
    RosettaReconciler.ContainsAccountCurrency = function (accountCurrencyMap, accountCurrency) {
        var element = accountCurrencyMap[utils_1.Hash(accountCurrency)];
        return element != null;
    };
    RosettaReconciler.prototype.inactiveAccountQueue = function (isInactive, accountCurrency, blockIdentifier) {
        return __awaiter(this, void 0, void 0, function () {
            var shouldEnqueueInactive;
            return __generator(this, function (_a) {
                shouldEnqueueInactive = false;
                if (!isInactive && !RosettaReconciler.ContainsAccountCurrency(this.seenAccounts, accountCurrency)) {
                    this.seenAccounts[utils_1.Hash(accountCurrency)] = {};
                    shouldEnqueueInactive = true;
                }
                if (isInactive || shouldEnqueueInactive) {
                    this.inactiveQueue.push({
                        entry: accountCurrency,
                        last_check: blockIdentifier
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    RosettaReconciler.prototype.reconcileActiveAccounts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var balanceChange, _a, block, value;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!true) return [3 /*break*/, 3];
                        balanceChange = this.changeQueue.shift();
                        if (balanceChange.block.index < this.highWaterMark)
                            return [3 /*break*/, 0];
                        return [4 /*yield*/, this.bestBalance(balanceChange.account_identifier, balanceChange.currency, utils_1.constructPartialBlockIdentifier(balanceChange.block))];
                    case 1:
                        _a = _b.sent(), block = _a.block, value = _a.value;
                        return [4 /*yield*/, this.accountReconciliation(balanceChange.account_identifier, balanceChange.currency, value, block, false)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 0];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RosettaReconciler.prototype.reconcileInactiveAccounts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, shouldAttempt, head, queueLen, nextAccount, nextValidIndex, _b, block, amount;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!true) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.shouldAttemptInactiveReconciliation()];
                    case 1:
                        _a = _c.sent(), shouldAttempt = _a.shouldAttempt, head = _a.head;
                        if (!!shouldAttempt) return [3 /*break*/, 3];
                        return [4 /*yield*/, sleep_1["default"](RECONCILIATION_INACTIVE_SLEEP_MS)];
                    case 2:
                        _c.sent();
                        return [3 /*break*/, 0];
                    case 3:
                        queueLen = this.inactiveQueue.length;
                        if (!(queueLen == 0)) return [3 /*break*/, 5];
                        if (this.debugLogging) {
                            this.logger.verbose('No accounts ready for inactive reconciliation (0 accounts in queue)');
                        }
                        return [4 /*yield*/, sleep_1["default"](RECONCILIATION_INACTIVE_SLEEP_MS)];
                    case 4:
                        _c.sent();
                        return [3 /*break*/, 0];
                    case 5:
                        nextAccount = this.inactiveQueue[0];
                        nextValidIndex = -1;
                        if (nextAccount.last_check != null) {
                            nextValidIndex = nextAccount.last_check.index + config.inactiveFrequency;
                        }
                        if (!(nextValidIndex <= head.index)) return [3 /*break*/, 8];
                        this.inactiveQueue.shift();
                        return [4 /*yield*/, this.bestBalance(nextAccount.entry.account_identifier, nextAccount.entry.currency, utils_1.constructPartialBlockIdentifier(head))];
                    case 6:
                        _b = _c.sent(), block = _b.block, amount = _b.amount;
                        return [4 /*yield*/, this.accountReconciliation(nextAccount.entry.account_identifier, nextAccount.entry.currency, amount, block, true)];
                    case 7:
                        _c.sent();
                        // Always re-enqueue accounts after they have been inactively
                        // reconciled. If we don't re-enqueue, we will never check
                        // these accounts again.
                        this.inactiveAccountQueue(true, nextAccount.entry, block);
                        return [3 /*break*/, 10];
                    case 8:
                        if (this.debugLogging) {
                            this.logger.verbose("No accounts ready for inactive reconciliation " +
                                ("(" + queueLen + " account(s) in queue, will reconcile next account at index " + nextValidIndex + ")"));
                        }
                        return [4 /*yield*/, sleep_1["default"](RECONCILIATION_INACTIVE_SLEEP_MS)];
                    case 9:
                        _c.sent();
                        _c.label = 10;
                    case 10: return [3 /*break*/, 0];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    RosettaReconciler.prototype.reconcile = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // ToDo: Multithreading support (worker?)
                    return [4 /*yield*/, Promise.all([
                            this.reconcileActiveAccounts(),
                            this.reconcileInactiveAccounts(),
                        ])];
                    case 1:
                        // ToDo: Multithreading support (worker?)
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    RosettaReconciler.extractAmount = function (amountArray, currency) {
        for (var _i = 0, amountArray_1 = amountArray; _i < amountArray_1.length; _i++) {
            var b = amountArray_1[_i];
            if (utils_1.Hash(b.currency) != utils_1.Hash(currency))
                continue;
            return b;
        }
        throw new Error("Could not extract amount for " + JSON.stringify(currency));
    };
    RosettaReconciler.prototype.getCurrencyBalance = function (fetcher, networkIdentifier, accountIdentifier, currency, partialBlockIdentifier) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, liveBlock, liveBalances, liveAmount;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetcher.AcountBalanceRetry(networkIdentifier, accountIdentifier, partialBlockIdentifier)];
                    case 1:
                        _a = _b.sent(), liveBlock = _a.liveBlock, liveBalances = _a.liveBalances;
                        try {
                            liveAmount = this.extractAmount(liveBalances, currency);
                            return [2 /*return*/, {
                                    block: liveBlock,
                                    value: liveAmount.value
                                }];
                        }
                        catch (e) {
                            throw new errors_1.ReconcilerError("Could not get " + JSON.stringify(currency) + " currency balance" +
                                (" for " + JSON.stringify(accountIdentifier) + ": " + e.message));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return RosettaReconciler;
}());
RosettaReconciler.AccountCurrency = /** @class */ (function () {
    function AccountCurrency(opts) {
        if (typeof opts == 'object' && opts.accountIdentifier) {
            var accountIdentifier = opts.accountIdentifier, currency = opts.currency;
            this.account = accountIdentifier;
            this.currency = currency;
        }
        else {
            var accountIdentifier = arguments[0], currency = arguments[1];
            this.account = arguments[0];
            this.currency = arguments[1];
        }
    }
    ;
    return AccountCurrency;
}());
RosettaReconciler.defaults = defaults;
exports["default"] = RosettaReconciler;
