
// SyncerError.js
export default class SyncerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SyncerError';
  }  
};