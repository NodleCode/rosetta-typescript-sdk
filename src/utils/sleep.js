module.exports = function (timeoutMs) {
  return new Promise((fulfill, _) => {
    setTimeout(fulfill, timeoutMs);
  });
};