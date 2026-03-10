
// GLOBAL ERROR HANDLER MIDDLEWARE
// Catches any unexpected errors in the whole app
// Must have 4 parameters — Express identifies it by (err, req, res, next)
// Must be registered LAST in server.js

const errorHandler = (err, req, res, next) => {
  console.error("Unexpected Error:", err.stack);

  // Handle Mongoose duplicate key error (e.g. email already exists)
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Duplicate value — this email is already registered",
    });
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      data: null,
      message: Object.values(err.errors).map((e) => e.message).join(", "),
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    data: null,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
