"use strict";
/**
 * PromisePool.test.js
 * Author: Yoshi Jaeger
 */
exports.__esModule = true;
var PromisePool_1 = require("./PromisePool");
var chai_1 = require("chai");
var array = [];
var poolSize = 2;
var testFunction = function (timeout, text) {
    return new Promise(function (fulfill, reject) {
        setTimeout(function () {
            array.push(text);
            fulfill(text);
        }, timeout);
    });
};
describe('PromisePool', function () {
    it('output should have the correct order', function (done) {
        PromisePool_1.create(poolSize, [
            [500, 'first'],
            [500, 'second'],
            [1000, 'fourth'],
            [100, 'third'],
        ], testFunction, PromisePool_1.arrayApplier).then(function (data) {
            console.log("All promises finished! Promises: " + data + ", Data: " + array);
            // Data should be in correct order
            chai_1.expect(array).to.deep.equal(['first', 'second', 'third', 'fourth']);
            // Promises should return their data in correct order
            chai_1.expect(data).to.deep.equal(['first', 'second', 'fourth', 'third']);
            // Test finished      
            done();
        });
    });
});
