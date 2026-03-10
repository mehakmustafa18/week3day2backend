const mongoose = require("mongoose");

// TASK SCHEMA — blueprint for every task in DB

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false, // new tasks start as not completed
    },
    // This links each task to a specific user
    // "ref: User" means this ID belongs to User collection
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Task", TaskSchema);
