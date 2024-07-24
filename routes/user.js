const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Sign in API
router.post("/sign-in", async (req, res) => {
  try {
    const { username } = req.body;
    const { email } = req.body;
    const existingUser = await User.findOne({ username: username });
    const existingEmail = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    } else if (username.length < 4) {
      return res
        .status(400)
        .json({ message: "Username must be at least 4 characters" });
    }
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashPass = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPass,
    });
    await newUser.save();
    return res.status(200).json({ message: "Sign in successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Internal Server Error" });
  }
});

router.post("/log-in", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (isMatch) {
      const token = jwt.sign(
        { id: existingUser._id, username: existingUser.username },
        "tcmTM",
        { expiresIn: "2d" }
      );
      return res.status(200).json({ id: existingUser._id, token: token });
    } else {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
