import { Currency } from 'types';
import Sign from './Sign';
export default class AmountDescription {
    exists: boolean;
    sign: Sign;
    currency: Currency;
    constructor({ exists, sign, currency }: {
        exists?: boolean;
        sign?: string;
        currency?: any;
    });
}
