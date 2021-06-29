
// AmountDescription.js

const Sign = require('./Sign');

module.exports = class AmountDescription {
  constructor({
    exists = false,
    sign = Sign.Any,
    currency = null,
  }) {
    this.exists = exists;
    this.sign = new Sign(sign);
    this.currency = currency;
  }
};