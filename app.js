const express = require("express");
const app = express();
require("dotenv").config();
require("./conn/conn");
const cors = require("cors");
const UserAPI = require("./routes/user");
const TaskAPI = require("./routes/task");

app.use(cors());

app.use(express.json());

app.use("/api/v1", UserAPI);
//localhost wil be localhost:1000/api/v1/sign-in
app.use("/api/v2", TaskAPI);

app.use("/", (req, res) => {
  res.send("Hello Backend MotherFucker");
});

// const PORT = 1000;
// app.listen(PORT, () => {
//   console.log("Server Started");
// });
app.listen(process.env.PORT, () => {
  console.log(`Server Started at port ${process.env.PORT}`);
});
