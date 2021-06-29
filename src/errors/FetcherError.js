
// FetcherError.js
export default class FetcherError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FetcherError';
  }
};