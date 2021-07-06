"use strict";
/* Data API: Construction */
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
exports.constructionPreprocess = exports.constructionPayloads = exports.constructionParse = exports.constructionHash = exports.constructionDerive = exports.constructionCombine = exports.constructionSubmit = exports.constructionMetadata = void 0;
/**
 * Get Transaction Construction Metadata
 * Get any information required to construct a transaction for a specific network. Metadata returned here could be a recent hash to use, an account sequence number, or even arbitrary chain state. It is up to the client to correctly populate the options object with any network-specific details to ensure the correct metadata is retrieved.  It is important to clarify that this endpoint should not pre-construct any transactions for the client (this should happen in the SDK). This endpoint is left purposely unstructured because of the wide scope of metadata that could be required.  In a future version of the spec, we plan to pass an array of Rosetta Operations to specify which metadata should be received and to create a transaction in an accompanying SDK. This will help to insulate the client from chain-specific details that are currently required here.
 *
 * constructionMetadataRequest ConstructionMetadataRequest
 * returns ConstructionMetadataResponse
 * */
var constructionMetadata = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var constructionMetadataRequest;
    return __generator(this, function (_a) {
        constructionMetadataRequest = params.constructionMetadataRequest;
        return [2 /*return*/, {}];
    });
}); };
exports.constructionMetadata = constructionMetadata;
/**
 * Submit a Signed Transaction
 * Submit a pre-signed transaction to the node. This call should not block on the transaction being included in a block. Rather, it should return immediately with an indication of whether or not the transaction was included in the mempool.  The transaction submission response should only return a 200 status if the submitted transaction could be included in the mempool. Otherwise, it should return an error.
 *
 * constructionSubmitRequest ConstructionSubmitRequest
 * returns ConstructionSubmitResponse
 * */
var constructionSubmit = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var constructionSubmitRequest;
    return __generator(this, function (_a) {
        constructionSubmitRequest = params.constructionSubmitRequest;
        return [2 /*return*/, {}];
    });
}); };
exports.constructionSubmit = constructionSubmit;
/**
 * Create Network Transaction from Signatures
 * Combine creates a network-specific transaction from an unsigned transaction and an array of provided signatures. The signed transaction returned from this method will be sent to the `/construction/submit` endpoint by the caller.
 *
 * constructionCombineRequest ConstructionCombineRequest
 * returns ConstructionCombineResponse
 * */
var constructionCombine = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var constructionSubmitRequest;
    return __generator(this, function (_a) {
        constructionSubmitRequest = params.constructionSubmitRequest;
        return [2 /*return*/, {}];
    });
}); };
exports.constructionCombine = constructionCombine;
/**
 * Derive an Address from a PublicKey
 * Derive returns the network-specific address associated with a public key. Blockchains that require an on-chain action to create an account should not implement this method.
 *
 * constructionDeriveRequest ConstructionDeriveRequest
 * returns ConstructionDeriveResponse
 * */
var constructionDerive = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var constructionDeriveRequest;
    return __generator(this, function (_a) {
        constructionDeriveRequest = params.constructionDeriveRequest;
        return [2 /*return*/, {}];
    });
}); };
exports.constructionDerive = constructionDerive;
/**
 * Get the Hash of a Signed Transaction
 * TransactionHash returns the network-specific transaction hash for a signed transaction.
 *
 * constructionHashRequest ConstructionHashRequest
 * returns TransactionIdentifierResponse
 * */
var constructionHash = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var constructionHashRequest;
    return __generator(this, function (_a) {
        constructionHashRequest = params.constructionHashRequest;
        return [2 /*return*/, {}];
    });
}); };
exports.constructionHash = constructionHash;
/**
 * Parse a Transaction
 * Parse is called on both unsigned and signed transactions to understand the intent of the formulated transaction. This is run as a sanity check before signing (after `/construction/payloads`) and before broadcast (after `/construction/combine`).
 *
 * constructionParseRequest ConstructionParseRequest
 * returns ConstructionParseResponse
 * */
var constructionParse = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var constructionParseRequest;
    return __generator(this, function (_a) {
        constructionParseRequest = params.constructionParseRequest;
        return [2 /*return*/, {}];
    });
}); };
exports.constructionParse = constructionParse;
/**
 * Generate an Unsigned Transaction and Signing Payloads
 * Payloads is called with an array of operations and the response from `/construction/metadata`. It returns an unsigned transaction blob and a collection of payloads that must be signed by particular addresses using a certain SignatureType. The array of operations provided in transaction construction often times can not specify all \"effects\" of a transaction (consider invoked transactions in Ethereum). However, they can deterministically specify the \"intent\" of the transaction, which is sufficient for construction. For this reason, parsing the corresponding transaction in the Data API (when it lands on chain) will contain a superset of whatever operations were provided during construction.
 *
 * constructionPayloadsRequest ConstructionPayloadsRequest
 * returns ConstructionPayloadsResponse
 * */
var constructionPayloads = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var constructionPayloadsRequest;
    return __generator(this, function (_a) {
        constructionPayloadsRequest = params.constructionPayloadsRequest;
        return [2 /*return*/, {}];
    });
}); };
exports.constructionPayloads = constructionPayloads;
/**
 * Create a Request to Fetch Metadata
 * Preprocess is called prior to `/construction/payloads` to construct a request for any metadata that is needed for transaction construction given (i.e. account nonce). The request returned from this method will be used by the caller (in a different execution environment) to call the `/construction/metadata` endpoint.
 *
 * constructionPreprocessRequest ConstructionPreprocessRequest
 * returns ConstructionPreprocessResponse
 * */
var constructionPreprocess = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var constructionPreprocessRequest;
    return __generator(this, function (_a) {
        constructionPreprocessRequest = params.constructionPreprocessRequest;
        return [2 /*return*/, {}];
    });
}); };
exports.constructionPreprocess = constructionPreprocess;
