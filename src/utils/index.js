// models: index.js

import { InputError } from '../errors';
import * as Client  from 'rosetta-node-sdk-client'

const PartialBlockIdentifier = Client.PartialBlockIdentifier

export function AddValues(a, b) {
  const parsedA = parseInt(a);
  const parsedB = parseInt(b);

  if (isNaN(parsedA)) {
    throw new AsserterError('SupportedNetworks must be an array');
  }

  if (isNaN(parsedB)) {
    throw new AsserterError('SupportedNetworks must be an array');
  }

  return `${parsedA + parsedB}`;
}

function SubtractValues(a, b) {
  const parsedA = parseInt(a);
  const parsedB = parseInt(b);

  if (isNaN(parsedA)) {
    throw new AsserterError('SupportedNetworks must be an array');
  }

  if (isNaN(parsedB)) {
    throw new AsserterError('SupportedNetworks must be an array');
  }

  return `${parsedA - parsedB}`;
}

function constructPartialBlockIdentifier(blockIdentifier) {
  return PartialBlockIdentifier.constructFromObject({
    hash: blockIdentifier.hash,
    index: blockIdentifier.index,
  });
}

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
    let values = [];
    const keys = Object.keys(input).sort();

    for (let key of keys) {
      if (typeof input[key] == 'object') {
        const subHash = Hash(input[key]);
        values.push(`${key}:${subHash}`);
      } else {
        values.push(`${key}:${input[key]}`);
      }
    }

    return values.join('|').hashCode();
  }

  if (typeof input == 'number') {
    return `${input}`;
  }

  if (typeof input == 'string') {
    return input.hashCode();
  }

  throw new Error(`Invalid type ${typeof input} for Hasher`);
}

function AmountValue(amount) {
  if (amount == null) {
    throw new Error(`Amount value cannot be null`);
  }

  if (typeof amount.value !== 'string') {
    throw new Error('Amount must be a string');
  }

  return parseInt(amount.value);
}

function NegateValue(amount) {
  if (amount == null) {
    throw new Error(`Amount value cannot be null`);
  }

  if (typeof amount !== 'string') {
    throw new Error('Amount must be a string');
  }

  const negated = 0 - parseInt(amount);
  return `${negated}`;
}

export {
  AddValues,
  SubtractValues,
  constructPartialBlockIdentifier,
  AmountValue,
  NegateValue,
  Hash,
};