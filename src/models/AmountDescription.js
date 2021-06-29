
// AmountDescription.js

import Sign, { Any } from './Sign';

export default class AmountDescription {
  constructor({
    exists = false,
    sign = Any,
    currency = null,
  }) {
    this.exists = exists;
    this.sign = new Sign(sign);
    this.currency = currency;
  }
};