const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { register, login, getProfile } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { validateRequest } = require("../middleware/validateRequest");

// VALIDATION RULES
// These arrays define what fields to check
// and what rules they must pass


const registerValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email"),

  body("password")
    .notEmpty().withMessage("Password is required"),
];


// ROUTES


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User registration and login
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Account created — returns JWT token
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: { id: "64abc", name: "John Doe", email: "john@example.com", token: "eyJ..." }
 *               message: "Account created successfully"
 *       400:
 *         description: Validation error or email already exists
 */
router.post("/register", registerValidation, validateRequest, register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful — returns JWT token
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: { id: "64abc", name: "John Doe", email: "john@example.com", token: "eyJ..." }
 *               message: "Logged in successfully"
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", loginValidation, validateRequest, login);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get logged-in user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data
 *       401:
 *         description: Not authorized
 */
router.get("/profile", protect, getProfile);

module.exports = router;
