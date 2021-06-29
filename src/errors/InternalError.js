// AsserterError.js

export default class InternalError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InternalError';
  }
}
