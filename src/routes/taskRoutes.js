const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  getAllTasks, getTaskById, createTask, updateTask, deleteTask, getStats
} = require("../controllers/taskController");
const { protect } = require("../middleware/auth");
const { validateRequest } = require("../middleware/validateRequest");

// VALIDATION RULES FOR TASKS

const createTaskValidation = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isString().withMessage("Title must be a string"),

  body("completed")
    .optional()
    .isBoolean().withMessage("completed must be true or false"),
];

const updateTaskValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty().withMessage("Title cannot be empty")
    .isString().withMessage("Title must be a string"),

  body("completed")
    .optional()
    .isBoolean().withMessage("completed must be true or false"),
];

// ALL TASK ROUTES ARE PROTECTED
// protect middleware runs before every handler


/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task CRUD — all routes require JWT token
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for logged-in user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter tasks by title keyword
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: [{ _id: "64abc", title: "Learn MongoDB", completed: false }]
 *               message: "Tasks fetched successfully"
 *       401:
 *         description: Not authorized — token missing or invalid
 */
router.get("/", protect, getAllTasks);

/**
 * @swagger
 * /api/tasks/stats:
 *   get:
 *     summary: Get task statistics for logged-in user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats object
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: { total: 5, completed: 2, pending: 3 }
 *               message: "Stats fetched successfully"
 */
router.get("/stats", protect, getStats);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get one task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task found
 *       404:
 *         description: Task not found
 *       403:
 *         description: Not your task
 */
router.get("/:id", protect, getTaskById);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Learn JWT"
 *               completed:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Task created
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: { _id: "64abc", title: "Learn JWT", completed: false }
 *               message: "Task created successfully"
 *       400:
 *         description: Validation error
 */
router.post("/", protect, createTaskValidation, validateRequest, createTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Title"
 *               completed:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Task updated
 *       404:
 *         description: Task not found
 */
router.put("/:id", protect, updateTaskValidation, validateRequest, updateTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted
 *       404:
 *         description: Task not found
 */
router.delete("/:id", protect, deleteTask);

module.exports = router;
