import { Currency } from 'types';
import Sign from './Sign';

export default class AmountDescription {
    exists: boolean;
    sign: Sign;
    currency: Currency;
    constructor({ exists = false, sign = Sign.Any, currency = null }) {
        this.exists = exists;
        this.sign = new Sign(sign);
        this.currency = currency;
    }
}
