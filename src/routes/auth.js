const jwt = require("jsonwebtoken");
const User = require("../models/User");

// AUTH MIDDLEWARE
// This runs BEFORE any protected route handler
// It checks: is the user logged in? (valid token?)

const protect = async (req, res, next) => {
  let token;

  // JWT token is sent in the request header like:
  // Authorization: Bearer eyJhbGci...
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token — remove the word "Bearer " from the string
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using our JWT_SECRET
      // If token is fake or expired, this will throw an error
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user from the decoded token ID
      // .select("-password") means: get everything EXCEPT password
      req.user = await User.findById(decoded.id).select("-password");

      // Call next() to move on to the actual route handler
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Not authorized — invalid or expired token",
      });
    }
  }

  // If no token was sent at all
  if (!token) {
    return res.status(401).json({
      success: false,
      data: null,
      message: "Not authorized — no token provided",
    });
  }
};

module.exports = { protect };
