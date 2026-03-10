const { validationResult } = require("express-validator");

// VALIDATE REQUEST MIDDLEWARE
// This runs after express-validator checks fields
// If any validation failed, it returns errors
// If all good, it calls next() to continue

const validateRequest = (req, res, next) => {
  // validationResult collects all validation errors
  const errors = validationResult(req);

  // If there are errors, send them back immediately
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  // No errors — continue to route handler
  next();
};

module.exports = { validateRequest };
