// Sign.js

const { InternalError } = require('../errors');
const { AmountValue } = require('../utils');

const ANY = '*';
const POSITIVE = '+';
const NEGATIVE = '-';

class Sign {
  constructor(input) {
    if ([ANY, POSITIVE, NEGATIVE].includes(input)) {
      this.type = input;

    } else if (typeof input == 'number') {
      switch(this.sign(input)) {
        case -1: this.type = NEGATIVE; break;
        case +1: this.type = POSITIVE; break;
        case 0: this.type = POSITIVE; break;
      }

    } else {
      throw new InternalError(`Sign's constructor doesn't allow '${input}'`);
    }
  }

  sign(number) {
    if (typeof number !== 'number') {
      throw new InternalError(`n in sign(n) must be a number`);
    }

    if (number > 0) return 1;
    if (number < 0) return -1;
    return 0;
  }

  match(amount) {
    if (this.type == ANY) {
      return true;
    }

    try {
      const numeric = AmountValue(amount);

      if (this.type == NEGATIVE && this.sign(numeric) == -1) {
        return true;
      }

      if (this.type == POSITIVE && this.sign(numeric) == 1) {
        return true;
      }
    } catch (e) {
      console.error(`ERROR`, e);
      return false;
    }

  }

  toString() {
    return this.type;
  }
}

Sign.Positive = POSITIVE;
Sign.Negative = NEGATIVE;
Sign.Any = ANY;

module.exports = Sign;
