const router = require("express").Router();
const Task = require("../models/task");
const User = require("../models/user");
const { authenticateToken } = require("./auth");

router.post("/create-task", authenticateToken, async (req, res) => {
  try {
    const { title, desc } = req.body;
    const { id } = req.headers;
    const newTask = new Task({ title: title, desc: desc });
    const savedTask = await newTask.save();
    const taskId = savedTask._id;
    await User.findByIdAndUpdate(id, { $push: { task: taskId._id } });
    res.status(200).json({ message: "Task Created" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get-all-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate({
      path: "task",
      option: { sort: { createdAt: -1 } },
    });
    res.status(200).json({ data: userData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/delete-tasks/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers.id;
    await Task.findByIdAndDelete(id);
    await User.findByIdAndUpdate(userId, { $pull: { task: id } });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/update-tasks/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, desc } = req.body;
    await Task.findByIdAndUpdate(id, { title: title, desc: desc });
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/update-imp-tasks/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const TaskData = await Task.findById(id);
    const ImpTask = TaskData.important;
    await Task.findByIdAndUpdate(id, { important: !ImpTask });
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put(
  "/update-complete-tasks/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      const TaskData = await Task.findById(id);
      const CompleteTask = TaskData.complete;
      await Task.findByIdAndUpdate(id, { complete: !CompleteTask });
      res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.get("/get-imp-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const Data = await User.findById(id).populate({
      path: "task",
      match: { important: true },
      option: { sort: { createdAt: -1 } },
    });
    const ImpTaskData = Data.task;
    res.status(200).json({ data: ImpTaskData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get-complete-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const Data = await User.findById(id).populate({
      path: "task",
      match: { complete: true },
      option: { sort: { createdAt: -1 } },
    });
    const CompTaskData = Data.task;
    res.status(200).json({ data: CompTaskData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get-incomplete-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const Data = await User.findById(id).populate({
      path: "task",
      match: { complete: false },
      option: { sort: { createdAt: -1 } },
    });
    const CompTaskData = Data.task;
    res.status(200).json({ data: CompTaskData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
