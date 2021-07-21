"use strict";
// models: index.js
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
exports.__esModule = true;
exports.NegateValue = exports.AmountValue = exports.Hash = exports.constructPartialBlockIdentifier = exports.SubtractValues = exports.AddValues = void 0;
var errors_1 = require("../errors");
var rosetta_node_sdk_client_1 = require("rosetta-node-sdk-client");
function AddValues(a, b) {
    var parsedA = parseInt(a);
    var parsedB = parseInt(b);
    if (isNaN(parsedA)) {
        throw new errors_1.AsserterError('SupportedNetworks must be an array');
    }
    if (isNaN(parsedB)) {
        throw new errors_1.AsserterError('SupportedNetworks must be an array');
    }
    return "" + (parsedA + parsedB);
}
exports.AddValues = AddValues;
function SubtractValues(a, b) {
    var parsedA = parseInt(a);
    var parsedB = parseInt(b);
    if (isNaN(parsedA)) {
        throw new errors_1.AsserterError('SupportedNetworks must be an array');
    }
    if (isNaN(parsedB)) {
        throw new errors_1.AsserterError('SupportedNetworks must be an array');
    }
    return "" + (parsedA - parsedB);
}
exports.SubtractValues = SubtractValues;
function constructPartialBlockIdentifier(blockIdentifier) {
    return rosetta_node_sdk_client_1.PartialBlockIdentifier.constructFromObject({
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
            hash = (hash << 5) - hash + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
});
function Hash(input) {
    var e_1, _a;
    if (typeof input == 'object') {
        var values = [];
        var keys = Object.keys(input).sort();
        try {
            for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                var key = keys_1_1.value;
                if (typeof input[key] == 'object') {
                    var subHash = Hash(input[key]);
                    values.push(key + ":" + subHash);
                }
                else {
                    values.push(key + ":" + input[key]);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (keys_1_1 && !keys_1_1.done && (_a = keys_1["return"])) _a.call(keys_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // @ts-ignore
        return values.join('|').hashCode();
    }
    if (typeof input == 'number') {
        return "" + input;
    }
    if (typeof input == 'string') {
        // @ts-ignore
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
