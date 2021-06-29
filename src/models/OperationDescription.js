// OperationDescription is used to describe an operation
export default  class OperationDescription {
  constructor({
    account,
    amount,
    metadata = [],
    type = '',
    allow_repeats = false,
    optional = false,
  }) {
    this.account = account;
    this.amount = amount;
    this.metadata = metadata;
    this.type = type;
    this.allow_repeats = allow_repeats;
    this.optional = optional;
  }
};