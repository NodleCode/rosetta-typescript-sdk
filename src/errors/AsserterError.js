// AsserterError.js

class AsserterError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AsserterError';
  }
}
module.exports = AsserterError;