// models: index.js

import { AsserterError } from '../errors';
import { PartialBlockIdentifier } from 'rosetta-node-sdk-client';
import { Amount, BlockIdentifier } from 'types';

export function AddValues(a: string, b: string) {
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

export function SubtractValues(a: string, b: string) {
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

export function constructPartialBlockIdentifier(
    blockIdentifier: BlockIdentifier
) {
    return PartialBlockIdentifier.constructFromObject({
        hash: blockIdentifier.hash,
        index: blockIdentifier.index,
    });
}

// http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
/* Object.defineProperty(String.prototype, 'hashCode', {
    value: function () {
        var hash = 0,
            i,
            chr;
        for (i = 0; i < this.length; i++) {
            chr = this.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    },
    configurable: true,
    writable: true,
}); */
export const hashCode = (string: string) => {
    var hash = 0,
        i,
        chr;
    for (i = 0; i < string.length; i++) {
        chr = string.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

export function Hash(input: string | number | object) {
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
        return hashCode(values.join('|'));
    }

    if (typeof input == 'number') {
        return `${input}`;
    }

    if (typeof input == 'string') {
        // @ts-ignore
        return hashCode(input);
    }

    throw new Error(`Invalid type ${typeof input} for Hasher`);
}

export function AmountValue(amount: Amount) {
    if (amount == null) {
        throw new Error(`Amount value cannot be null`);
    }

    if (typeof amount.value !== 'string') {
        throw new Error('Amount must be a string');
    }

    return parseInt(amount.value);
}

export function NegateValue(amount: string) {
    if (amount == null) {
        throw new Error(`Amount value cannot be null`);
    }

    if (typeof amount !== 'string') {
        throw new Error('Amount must be a string');
    }

    const negated = 0 - parseInt(amount);
    return `${negated}`;
}
