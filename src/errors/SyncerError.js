
// SyncerError.js
class SyncerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SyncerError';
  }  
};
module.exports = SyncerError;