import { Amount } from 'types';
export declare const ANY = "*";
declare class Sign {
    static Positive: string;
    static Negative: string;
    static Any: string;
    type: string;
    constructor(input: string | number);
    sign(number: number): 0 | 1 | -1;
    match(amount: Amount): boolean;
    toString(): string;
}
export default Sign;
