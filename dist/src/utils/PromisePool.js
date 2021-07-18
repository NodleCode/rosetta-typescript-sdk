"use strict";
/**
 * PromisePool.js
 * Author: Yoshi Jaeger
 *
 * Adapted the code from https://github.com/rxaviers/async-pool/blob/master/lib/es7.js
 * to use an applier proxy.
 */
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
exports.arrayApplier = exports.defaultApplier = exports.create = void 0;
var defaultApplier = function (promiseBodyFn, arg) {
    var r = promiseBodyFn(arg);
    return r;
};
exports.defaultApplier = defaultApplier;
var arrayApplier = function (promiseBodyFn, args) {
    if (args === void 0) { args = []; }
    var r = promiseBodyFn.apply(void 0, __spreadArray([], __read(args)));
    return r;
};
exports.arrayApplier = arrayApplier;
function PromisePool(poolLimit, argArray, promiseBodyFn, applierFn) {
    if (poolLimit === void 0) { poolLimit = 8; }
    if (applierFn === void 0) { applierFn = defaultApplier; }
    return __awaiter(this, void 0, void 0, function () {
        var ret, executing, _loop_1, argArray_1, argArray_1_1, item, e_1_1;
        var e_1, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ret = [];
                    executing = [];
                    _loop_1 = function (item) {
                        var p, e;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    p = Promise.resolve().then(function () { return applierFn(promiseBodyFn, item); });
                                    ret.push(p);
                                    e = p.then(function () { return executing.splice(executing.indexOf(e), 1); });
                                    executing.push(e);
                                    if (!(executing.length >= poolLimit)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, Promise.race(executing)];
                                case 1:
                                    _c.sent();
                                    _c.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 8]);
                    argArray_1 = __values(argArray), argArray_1_1 = argArray_1.next();
                    _b.label = 2;
                case 2:
                    if (!!argArray_1_1.done) return [3 /*break*/, 5];
                    item = argArray_1_1.value;
                    return [5 /*yield**/, _loop_1(item)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    argArray_1_1 = argArray_1.next();
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 8];
                case 6:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 8];
                case 7:
                    try {
                        if (argArray_1_1 && !argArray_1_1.done && (_a = argArray_1["return"])) _a.call(argArray_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/, Promise.all(ret)];
            }
        });
    });
}
exports.create = PromisePool;
