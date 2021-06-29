
// FetcherError.js
class FetcherError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FetcherError';
  }
};
module.exports = FetcherError;