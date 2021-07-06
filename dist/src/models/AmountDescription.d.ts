export default class AmountDescription {
    constructor({ exists, sign, currency, }: {
        exists?: boolean;
        sign?: any;
        currency?: any;
    });
    exists: boolean;
    sign: Sign;
    currency: any;
}
import Sign from "./Sign";
