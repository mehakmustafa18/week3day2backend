const Task = require("../models/Task");


// GET ALL TASKS — GET /api/tasks
// Returns only tasks that belong to logged-in user
// Optional: ?title=xxx to filter by title

const getAllTasks = async (req, res, next) => {
  try {
    const { title } = req.query;

    // Build the query — always filter by logged-in user
    // req.user._id comes from auth middleware
    const query = { user: req.user._id };

    // If title filter provided, search case-insensitively
    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: tasks,
      message: "Tasks fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};


// GET TASK BY ID — GET /api/tasks/:id

const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    // Check if task exists
    if (!task) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Task not found",
      });
    }

    // Check if this task belongs to logged-in user
    // task.user is ObjectId, req.user._id is also ObjectId — use .toString() to compare
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        data: null,
        message: "Not authorized — this task belongs to another user",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
      message: "Task fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};


// CREATE TASK — POST /api/tasks

const createTask = async (req, res, next) => {
  try {
    const { title, completed } = req.body;

    // Create task — attach logged-in user's ID to it
    const task = await Task.create({
      title,
      completed: completed !== undefined ? completed : false,
      user: req.user._id, // link this task to the current user
    });

    res.status(201).json({
      success: true,
      data: task,
      message: "Task created successfully",
    });
  } catch (error) {
    next(error);
  }
};


// UPDATE TASK — PUT /api/tasks/:id

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Task not found",
      });
    }

    // Only the owner can update the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        data: null,
        message: "Not authorized — this task belongs to another user",
      });
    }

    const { title, completed } = req.body;

    // Update only the fields that were provided
    if (title !== undefined) task.title = title;
    if (completed !== undefined) task.completed = completed;

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      data: updatedTask,
      message: "Task updated successfully",
    });
  } catch (error) {
    next(error);
  }
};


// DELETE TASK — DELETE /api/tasks/:id

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Task not found",
      });
    }

    // Only the owner can delete the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        data: null,
        message: "Not authorized — this task belongs to another user",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      data: task,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


// STATS — GET /api/tasks/stats

const getStats = async (req, res, next) => {
  try {
    // Count only this user's tasks
    const total = await Task.countDocuments({ user: req.user._id });
    const completed = await Task.countDocuments({ user: req.user._id, completed: true });
    const pending = total - completed;

    res.status(200).json({
      success: true,
      data: { total, completed, pending },
      message: "Stats fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask, getStats };
