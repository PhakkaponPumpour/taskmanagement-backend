const mongoose = require("mongoose");
const task = require("./task");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  // import task from /models/task.js
  task: [
    {
      type: mongoose.Types.ObjectId,
      ref: "task",
    },
  ],
});

/// export user to MongoDB
module.exports = mongoose.model("user", userSchema);
