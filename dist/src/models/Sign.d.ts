export const ANY: "*";
export default Sign;
declare class Sign {
    constructor(input: any);
    type: any;
    sign(number: any): 1 | 0 | -1;
    match(amount: any): boolean;
    toString(): any;
}
declare namespace Sign {
    export { POSITIVE as Positive };
    export { NEGATIVE as Negative };
    export { ANY as Any };
}
declare const POSITIVE: "+";
declare const NEGATIVE: "-";
