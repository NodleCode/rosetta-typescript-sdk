"use strict";
/**
 * PromisePool.test.js
 * Author: Yoshi Jaeger
 */
Object.defineProperty(exports, "__esModule", { value: true });
const PromisePool_1 = require("./PromisePool");
const chai_1 = require("chai");
const array = [];
const poolSize = 2;
const testFunction = (timeout, text) => {
    return new Promise((fulfill, reject) => {
        setTimeout(() => {
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
        ], testFunction, PromisePool_1.arrayApplier).then(data => {
            console.log(`All promises finished! Promises: ${data}, Data: ${array}`);
            // Data should be in correct order
            chai_1.expect(array).to.deep.equal(['first', 'second', 'third', 'fourth']);
            // Promises should return their data in correct order
            chai_1.expect(data).to.deep.equal(['first', 'second', 'fourth', 'third']);
            // Test finished      
            done();
        });
    });
});
