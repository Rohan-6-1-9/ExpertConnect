/**
 * Wraps async route handlers to automatically catch rejected promises
 * and forward them to Express's next() error handler — no try/catch needed in controllers.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;