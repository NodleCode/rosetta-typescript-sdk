/**
 * PromisePool.test.js
 * Author: Yoshi Jaeger
 */

import { create, arrayApplier } from './PromisePool';
import { expect } from 'chai';

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
    create(
      poolSize,
      [
        [500, 'first'],
        [500, 'second'],
        [1000, 'fourth'],
        [100,  'third'],
      ],
      testFunction,
      arrayApplier,
    ).then(data => {
      console.log(`All promises finished! Promises: ${data}, Data: ${array}`);

      // Data should be in correct order
      expect(array).to.deep.equal(['first', 'second', 'third', 'fourth']);

      // Promises should return their data in correct order
      expect(data).to.deep.equal(['first', 'second', 'fourth', 'third']);

      // Test finished      
      done();
    });    
  });
});

