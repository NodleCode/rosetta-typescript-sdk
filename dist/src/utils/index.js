"use strict";
// models: index.js
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
exports.Hash = exports.NegateValue = exports.AmountValue = exports.constructPartialBlockIdentifier = exports.SubtractValues = exports.AddValues = void 0;
var Client = __importStar(require("rosetta-node-sdk-client"));
var PartialBlockIdentifier = Client.PartialBlockIdentifier;
function AddValues(a, b) {
    var parsedA = parseInt(a);
    var parsedB = parseInt(b);
    if (isNaN(parsedA)) {
        throw new AsserterError('SupportedNetworks must be an array');
    }
    if (isNaN(parsedB)) {
        throw new AsserterError('SupportedNetworks must be an array');
    }
    return "" + (parsedA + parsedB);
}
exports.AddValues = AddValues;
function SubtractValues(a, b) {
    var parsedA = parseInt(a);
    var parsedB = parseInt(b);
    if (isNaN(parsedA)) {
        throw new AsserterError('SupportedNetworks must be an array');
    }
    if (isNaN(parsedB)) {
        throw new AsserterError('SupportedNetworks must be an array');
    }
    return "" + (parsedA - parsedB);
}
exports.SubtractValues = SubtractValues;
function constructPartialBlockIdentifier(blockIdentifier) {
    return PartialBlockIdentifier.constructFromObject({
        hash: blockIdentifier.hash,
        index: blockIdentifier.index
    });
}
exports.constructPartialBlockIdentifier = constructPartialBlockIdentifier;
// http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
Object.defineProperty(String.prototype, 'hashCode', {
    value: function () {
        var hash = 0, i, chr;
        for (i = 0; i < this.length; i++) {
            chr = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
});
function Hash(input) {
    if (typeof input == 'object') {
        var values = [];
        var keys = Object.keys(input).sort();
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (typeof input[key] == 'object') {
                var subHash = Hash(input[key]);
                values.push(key + ":" + subHash);
            }
            else {
                values.push(key + ":" + input[key]);
            }
        }
        return values.join('|').hashCode();
    }
    if (typeof input == 'number') {
        return "" + input;
    }
    if (typeof input == 'string') {
        return input.hashCode();
    }
    throw new Error("Invalid type " + typeof input + " for Hasher");
}
exports.Hash = Hash;
function AmountValue(amount) {
    if (amount == null) {
        throw new Error("Amount value cannot be null");
    }
    if (typeof amount.value !== 'string') {
        throw new Error('Amount must be a string');
    }
    return parseInt(amount.value);
}
exports.AmountValue = AmountValue;
function NegateValue(amount) {
    if (amount == null) {
        throw new Error("Amount value cannot be null");
    }
    if (typeof amount !== 'string') {
        throw new Error('Amount must be a string');
    }
    var negated = 0 - parseInt(amount);
    return "" + negated;
}
exports.NegateValue = NegateValue;
