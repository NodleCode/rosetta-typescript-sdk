// AsserterError.js

export default class AsserterError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AsserterError';
  }
}