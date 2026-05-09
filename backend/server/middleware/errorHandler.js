const AppError = require("../utils/AppError");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // ── Log in development ──
  if (process.env.NODE_ENV === "development") {
    console.error("❌ ERROR:", err);
  }

  // ── Mongoose: bad ObjectId ──
  if (err.name === "CastError") {
    error = new AppError(`Resource not found with id: ${err.value}`, 404);
  }

  // ── Mongoose: duplicate key (unique index violation) ──
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(", ");
    error = new AppError(
      `Duplicate value for field(s): ${field}. This slot is already booked.`,
      409
    );
  }

  // ── Mongoose: validation error ──
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = new AppError(messages.join(". "), 400);
  }

  // ── JWT errors (placeholder for future auth) ──
  if (err.name === "JsonWebTokenError") {
    error = new AppError("Invalid token. Please log in again.", 401);
  }
  if (err.name === "TokenExpiredError") {
    error = new AppError("Token expired. Please log in again.", 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;