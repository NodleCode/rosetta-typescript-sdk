export default class Descriptions {
    constructor({ operation_descriptions, equal_amounts, opposite_amounts, equal_addresses, err_unmatched, }: {
        operation_descriptions?: any[];
        equal_amounts?: any[];
        opposite_amounts?: any[];
        equal_addresses?: any[];
        err_unmatched?: boolean;
    });
    operation_descriptions: any[];
    equal_amounts: any[];
    opposite_amounts: any[];
    equal_addresses: any[];
    err_unmatched: boolean;
}
