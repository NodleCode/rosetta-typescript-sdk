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
exports.networkStatus = exports.networkOptions = exports.networkList = void 0;
var rosetta_node_sdk_client_1 = require("rosetta-node-sdk-client");
var Types = rosetta_node_sdk_client_1.Client;
var network_1 = require("../network");
/* Data API: Network */
/**
 * Get List of Available Networks
 * This endpoint returns a list of NetworkIdentifiers that the Rosetta server can handle.
 *
 * metadataRequest MetadataRequest
 * returns NetworkListResponse
 * */
var networkList = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var metadataRequest;
    return __generator(this, function (_a) {
        metadataRequest = params.metadataRequest;
        return [2 /*return*/, new Types.NetworkListResponse([network_1.networkIdentifier])];
    });
}); };
exports.networkList = networkList;
/**
 * Get Network Options
 * This endpoint returns the version information and allowed network-specific types for a NetworkIdentifier. Any NetworkIdentifier returned by /network/list should be accessible here.  Because options are retrievable in the context of a NetworkIdentifier, it is possible to define unique options for each network.
 *
 * networkRequest NetworkRequest
 * returns NetworkOptionsResponse
 * */
var networkOptions = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var networkRequest, rosettaVersion, nodeVersion, operationStatuses, operationTypes, errors;
    return __generator(this, function (_a) {
        networkRequest = params.networkRequest;
        rosettaVersion = '1.4.0';
        nodeVersion = '0.0.1';
        operationStatuses = [
            new Types.OperationStatus('Success', true),
            new Types.OperationStatus('Reverted', false),
        ];
        operationTypes = ['Transfer', 'Reward'];
        errors = [new Types.Error(1, 'not implemented', false)];
        return [2 /*return*/, new Types.NetworkOptionsResponse(new Types.Version(rosettaVersion, nodeVersion), new Types.Allow(operationStatuses, operationTypes, errors))];
    });
}); };
exports.networkOptions = networkOptions;
/**
 * Get Network Status
 * This endpoint returns the current status of the network requested. Any NetworkIdentifier returned by /network/list should be accessible here.
 *
 * networkRequest NetworkRequest
 * returns NetworkStatusResponse
 * */
var networkStatus = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var networkRequest, currentBlockIdentifier, currentBlockTimestamp, genesisBlockIdentifier, peers;
    return __generator(this, function (_a) {
        networkRequest = params.networkRequest;
        currentBlockIdentifier = new Types.BlockIdentifier(1000, 'block 1000');
        currentBlockTimestamp = 1586483189000;
        genesisBlockIdentifier = new Types.BlockIdentifier(0, 'block 0');
        peers = [new Types.Peer('peer 1')];
        return [2 /*return*/, new Types.NetworkStatusResponse(currentBlockIdentifier, currentBlockTimestamp, genesisBlockIdentifier, peers)];
    });
}); };
exports.networkStatus = networkStatus;
