const router = require("express").Router();

////the schema for tasks and is used for interacting with the tasks collection in MongoDB.
const Task = require("../models/task");

////the schema for users and is used for interacting with the users collection in MongoDB.
const User = require("../models/user");

////Imports the authenticateToken middleware function from ./auth. 
///This middleware function is used to verify JWT tokens and ensure that requests are authenticated.
const { authenticateToken } = require("./auth");



router.post("/create-task", authenticateToken, async (req, res) => {
  try {

    ///itle and desc from the request body (req.body), which contains the data sent 
    ///by the client when creating a task
    const { title, desc } = req.body;
    const { id } = req.headers;

    //Creates a new data of the Task model with the provided title and desc.
    ///Uses await to save the new task to the database. The savedTask variable holds the saved task, 
    ///including its generated _id.
    const newTask = new Task({ title: title, desc: desc });
    const savedTask = await newTask.save();

    ///_id of the saved task (taskId).
    ///Uses User."findByIdAndUpdate"() to find the user by their ID and push the new task's ID 
    //into the task array field in the user's document. 
    //This updates the user's list of tasks to include the newly created task.
    const taskId = savedTask._id;
    await User.findByIdAndUpdate(id, { $push: { task: taskId._id } });
    res.status(200).json({ message: "Task Created" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


///GET route at the /get-all-tasks endpoint.
router.get("/get-all-tasks", authenticateToken, async (req, res) => {
  try {
    ///_id of the authenticated user (id).
    const { id } = req.headers;

    //User.findById(id) to find the user document by its ID.
    //Uses .populate() to fetch the tasks associated with the user
    const userData = await User.findById(id).populate({
      //path: "task": Specifies the field in the User schema that references the tasks.
      //Sorts the tasks by the createdAt field in descending order (newest first).
      path: "task",
      option: { sort: { createdAt: -1 } },
    });
    ///user information along with theirs tasks.
    res.status(200).json({ data: userData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


///DELETE route at the /delete-tasks/:id 
///representing the task ID to be deleted.
router.delete("/delete-tasks/:id", authenticateToken, async (req, res) => {
  try {

    ///Extracts the task ID from the route parameters (req.params.id). 
    ///that the user wants to delete
    const { id } = req.params;

    ///User ID from the request headers (req.headers.id). 
    ///This ID is the user who is deleting the task.
    const userId = req.headers.id;

    ///find the task by its ID and delete it from the Task collection in the database.
    await Task.findByIdAndDelete(id);

    // find the user by their ID (userId) and update their document.
    ///$pull operator is used to remove the task ID from the task array field in the user's document, 
    await User.findByIdAndUpdate(userId, { $pull: { task: id } });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

///update where :id is a dynamic route parameter representing the task ID to be updated.
router.put("/update-tasks/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    ///title and desc from the request body (req.body),
    //which contains the new data that the user wants to update in the task.
    const { title, desc } = req.body;
    ///find the task by its ID and update its title and desc fields with the new values.
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

    // find the task in the database by its ID and retrieve its current data. 
    //This fetches the entire task document
    const TaskData = await Task.findById(id);

    //Extracts the important field from the retrieved TaskData. 
    //This represents whether the task is currently marked as "important" (true) or not (false).
    const ImpTask = TaskData.important;

    //If the task is marked as "important" (true), update it to "not important
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

      //If the task is marked as "important" (true), update it to "not important
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

    ///User.findById(id) to find the user by their ID in the User collection.
    //Uses .populate() to retrieve the tasks related to this user, but with additional filters:
    // path: Specifies that the related task field in the User document 
    //match: Filters the populated tasks to only include those with important: true
    //"option": Sorts the tasks by createdAt.
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
