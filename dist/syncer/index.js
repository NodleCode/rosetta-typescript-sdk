"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var Client = __importStar(require("rosetta-node-sdk-client"));
var events_1 = __importDefault(require("events"));
var errors_1 = require("../errors");
var utils_1 = require("../utils");
var events_2 = __importStar(require("./events"));
var sleep_1 = __importDefault(require("../utils/sleep"));
var PartialBlockIdentifier = Client.PartialBlockIdentifier;
/**
 * RosettaSyncer
 * Emits blockAdded and blockRemoved Events during sync.
 * Emits cancel if sync was cancelled.
 */
var RosettaSyncer = /** @class */ (function (_super) {
    __extends(RosettaSyncer, _super);
    function RosettaSyncer(_a) {
        var networkIdentifier = _a.networkIdentifier, fetcher = _a.fetcher, _b = _a.pastBlocks, pastBlocks = _b === void 0 ? [] : _b, _c = _a.maxSync, maxSync = _c === void 0 ? 999 : _c, _d = _a.pastBlockSize, pastBlockSize = _d === void 0 ? 40 : _d, _e = _a.defaultSyncSleep, defaultSyncSleep = _e === void 0 ? 5000 : _e, _f = _a.genesisBlock, genesisBlock = _f === void 0 ? null : _f;
        var _this = _super.call(this) || this;
        _this.networkIdentifier = networkIdentifier;
        _this.fetcher = fetcher;
        _this.pastBlocks = pastBlocks;
        _this.genesisBlock = genesisBlock;
        _this.nextIndex = null;
        _this.maxSync = maxSync;
        _this.pastBlockSize = pastBlockSize;
        _this.defaultSyncSleep = defaultSyncSleep;
        return _this;
        // ToDo: Type checks
    }
    RosettaSyncer.prototype.setStart = function (startIndex) {
        if (startIndex === void 0) { startIndex = -1; }
        return __awaiter(this, void 0, void 0, function () {
            var networkStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetcher.networkStatusRetry(this.networkIdentifier)];
                    case 1:
                        networkStatus = _a.sent();
                        if (startIndex != -1) {
                            this.nextIndex = startIndex;
                            return [2 /*return*/];
                        }
                        this.gensesisBlock = networkStatus.genesis_block_identifier;
                        this.nextIndex = networkStatus.genesis_block_identifier.index;
                        return [2 /*return*/];
                }
            });
        });
    };
    RosettaSyncer.prototype.nextSyncableRange = function (endIndexIn) {
        return __awaiter(this, void 0, void 0, function () {
            var endIndex, networkStatus, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endIndex = endIndexIn;
                        if (this.nextIndex == -1) {
                            throw new errors_1.SyncerError('Unable to determine current head');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.fetcher.networkStatusRetry(this.networkIdentifier)];
                    case 2:
                        networkStatus = _a.sent();
                        if (endIndex == -1 || endIndex > networkStatus.current_block_identifier.index) {
                            endIndex = networkStatus.current_block_identifier.index;
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        throw new errors_1.SyncerError("Unable to get network status: " + e_1.message);
                    case 4:
                        if (this.nextIndex > endIndex) {
                            return [2 /*return*/, {
                                    halt: true,
                                    rangeEnd: -1
                                }];
                        }
                        if (endIndex - this.nextIndex > this.maxSync) {
                            endIndex = this.nextIndex + this.maxSync;
                        }
                        return [2 /*return*/, {
                                halt: false,
                                rangeEnd: endIndex
                            }];
                }
            });
        });
    };
    RosettaSyncer.prototype.checkRemove = function (block) {
        return __awaiter(this, void 0, void 0, function () {
            var lastBlock;
            return __generator(this, function (_a) {
                // ToDo: Type check block
                if (this.pastBlocks.length == 0) {
                    return [2 /*return*/, {
                            shouldRemove: false,
                            lastBlock: null
                        }];
                }
                // Ensure processing correct index
                if (block.block_identifier.index != this.nextIndex) {
                    throw new errors_1.SyncerError("Get block " + block.block_identifier.index + " instead of " + this.nextIndex);
                }
                lastBlock = this.pastBlocks[this.pastBlocks.length - 1];
                if (utils_1.Hash(block.parent_block_identifier) != utils_1.Hash(lastBlock)) {
                    if (utils_1.Hash(this.genesisBlock) == utils_1.Hash(lastBlock)) {
                        throw new errors_1.SyncerError('Cannot remove genesis block');
                    }
                    // Block can be removed.
                    return [2 /*return*/, {
                            shouldRemove: true,
                            lastBlock: lastBlock
                        }];
                }
                return [2 /*return*/, {
                        shouldRemove: false,
                        lastBlock: lastBlock
                    }];
            });
        });
    };
    RosettaSyncer.prototype.processBlock = function (blockIn) {
        return __awaiter(this, void 0, void 0, function () {
            var block, _a, shouldRemove, lastBlock;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        block = Object.assign({}, blockIn);
                        return [4 /*yield*/, this.checkRemove(block)];
                    case 1:
                        _a = _b.sent(), shouldRemove = _a.shouldRemove, lastBlock = _a.lastBlock;
                        if (shouldRemove) {
                            // Notify observers that a block was removed
                            this.emit(events_2.BLOCK_REMOVED, lastBlock);
                            // Remove the block internally
                            this.pastBlocks.pop();
                            this.nextIndex = lastBlock.index;
                            return [2 /*return*/];
                        }
                        // Notify observers that a block was added
                        this.emit(events_2.BLOCK_ADDED, block);
                        // Add the block internally
                        this.pastBlocks.push(block.block_identifier);
                        if (this.pastBlocks.length > this.pastBlockSize) {
                            this.pastBlocks.shift();
                        }
                        this.nextIndex = block.block_identifier.index + 1;
                        return [2 /*return*/];
                }
            });
        });
    };
    RosettaSyncer.prototype.blockArrayToMap = function (blockArray) {
        return blockArray.reduce(function (a, c) {
            a[c.block_identifier.index] = c;
            return a;
        }, {});
    };
    RosettaSyncer.prototype.syncRange = function (endIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var nextIndex, blockArray, blockMap, block, partialBlockIdentifier;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nextIndex = this.nextIndex;
                        return [4 /*yield*/, this.fetcher.blockRange(this.networkIdentifier, nextIndex, endIndex)];
                    case 1:
                        blockArray = _a.sent();
                        blockMap = this.blockArrayToMap(blockArray);
                        _a.label = 2;
                    case 2:
                        if (!(this.nextIndex <= endIndex)) return [3 /*break*/, 7];
                        block = blockMap[this.nextIndex];
                        if (!!block) return [3 /*break*/, 4];
                        partialBlockIdentifier = PartialBlockIdentifier.constructFromObject({
                            index: this.nextIndex
                        });
                        return [4 /*yield*/, this.fetcher.blockRetry(this.networkIdentifier, partialBlockIdentifier)];
                    case 3:
                        block = _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        // We are going to refetch the block.
                        // Delete the current version of it.
                        delete blockMap[this.nextIndex];
                        _a.label = 5;
                    case 5: return [4 /*yield*/, this.processBlock(block)];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /** Syncs the blockchain in the requested range.
     *  Endless cycle unless an error happens or the requested range was synced successfully.
     * @param {number} startIndex - Index to start sync from
     * @param {number} endIndex - Index to end sync at (inclusive).
     */
    RosettaSyncer.prototype.sync = function (startIndex, endIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var e_2, rangeEnd, halt, result, e_3, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (startIndex == null || endIndex == null ||
                            isNaN(startIndex) || isNaN(endIndex)) {
                            throw new errors_1.SyncerError("Arguments startIndex and endIndex must be a valid number");
                        }
                        this.emit(events_2.SYNC_CANCELLED);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.setStart(startIndex)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        throw new errors_1.SyncerError("Unable to set sync start index: " + e_2.message);
                    case 4:
                        if (!true) return [3 /*break*/, 15];
                        rangeEnd = void 0;
                        halt = void 0;
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, this.nextSyncableRange(endIndex)];
                    case 6:
                        result = _a.sent();
                        rangeEnd = result.rangeEnd;
                        halt = result.halt;
                        return [3 /*break*/, 8];
                    case 7:
                        e_3 = _a.sent();
                        throw new errors_1.SyncerError("Unable to get next syncable range: " + e_3.message);
                    case 8:
                        if (!halt) return [3 /*break*/, 10];
                        if (this.nextIndex > endIndex && endIndex != -1) {
                            // Quit Sync.
                            return [3 /*break*/, 15];
                        }
                        return [4 /*yield*/, sleep_1["default"](this.defaultSyncSleep)];
                    case 9:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 10:
                        if (this.nextIndex != rangeEnd) {
                            logger.verbose("Syncing " + this.nextIndex + "-" + rangeEnd);
                        }
                        else {
                            logger.verbose("Syncing " + this.nextIndex);
                        }
                        _a.label = 11;
                    case 11:
                        _a.trys.push([11, 13, , 14]);
                        return [4 /*yield*/, this.syncRange(rangeEnd)];
                    case 12:
                        _a.sent();
                        return [3 /*break*/, 14];
                    case 13:
                        e_4 = _a.sent();
                        console.error(e_4);
                        throw new errors_1.SyncerError("Unable to sync to " + rangeEnd + ": " + e_4.message);
                    case 14: return [3 /*break*/, 4];
                    case 15:
                        if (startIndex == -1) {
                            startIndex = this.genesisBlock.index;
                        }
                        logger.info("Finished Syncing " + startIndex + "-" + endIndex);
                        return [2 /*return*/];
                }
            });
        });
    };
    return RosettaSyncer;
}(events_1["default"]));
RosettaSyncer.Events = events_2["default"];
exports["default"] = RosettaSyncer;
