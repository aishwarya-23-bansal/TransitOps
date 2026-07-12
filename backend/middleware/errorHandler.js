class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(error, req, res, next) { // eslint-disable-line no-unused-vars
  if (error.name === 'CastError') error = new ApiError(400, 'Invalid resource id.');
  if (error.name === 'ValidationError') error = new ApiError(400, error.message);
  console.error(error);
  res.status(error.statusCode || 500).json({ message: error.message || 'Internal server error.' });
}

module.exports = { ApiError, asyncHandler, notFound, errorHandler };
