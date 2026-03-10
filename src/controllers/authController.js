const jwt = require("jsonwebtoken");
const User = require("../models/User");


// HELPER — generates a JWT token for a user ID

const generateToken = (id) => {
  return jwt.sign(
    { id }, // payload — what we store inside the token
    process.env.JWT_SECRET, // secret key to sign it
    { expiresIn: "7d" } // token expires in 7 days
  );
};


// REGISTER — POST /api/users/register
// Creates a new user account

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "An account with this email already exists",
      });
    }

    // Create new user — password gets hashed automatically by User model
    const user = await User.create({ name, email, password });

    // Generate JWT token for the new user
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        token, // send token so user can start using API immediately
      },
      message: "Account created successfully",
    });
  } catch (error) {
    next(error); // pass to global error handler
  }
};


// LOGIN — POST /api/users/login
// Logs in and returns a JWT token

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists AND password matches
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        token, // user saves this token for future requests
      },
      message: "Logged in successfully",
    });
  } catch (error) {
    next(error);
  }
};

// GET PROFILE — GET /api/users/profile
// Returns logged-in user's info (protected route)

const getProfile = async (req, res) => {
  // req.user is set by the auth middleware
  res.status(200).json({
    success: true,
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
    message: "Profile fetched successfully",
  });
};

module.exports = { register, login, getProfile };
