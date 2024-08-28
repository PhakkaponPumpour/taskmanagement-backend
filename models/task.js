const mongoose = require("mongoose");

// create moongoose.Schema to manage Task in MongoDB  
const taskScema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
      unique: true,
    },
    important: {
      type: Boolean,
      default: false,
    },
    complete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/// export task to mongoDB
module.exports = mongoose.model("task", taskScema);
