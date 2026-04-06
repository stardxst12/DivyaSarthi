const router = require("express").Router();
const User = require("../models/User");

let jwtModule;
function jwt() {
  if (!jwtModule) jwtModule = require("jsonwebtoken");
  return jwtModule;
}

let bcryptModule;
function bcrypt() {
  if (!bcryptModule) bcryptModule = require("bcrypt");
  return bcryptModule;
}

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    })
      .select("_id")
      .lean();
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or Email already in use!" });
    }

    const salt = await bcrypt().genSalt(10);
    const hashedPassword = await bcrypt().hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required!" });
    }

    const user = await User.findOne({ username }).lean();
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid Username or Password!" });
    }

    const validPassword = await bcrypt().compare(password, user.password);
    if (!validPassword) {
      return res
        .status(401)
        .json({ message: "Invalid Username or Password!" });
    }

    const secret = process.env.JWT_SEC;
    if (!secret) {
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    const accessToken = jwt().sign(
      { id: user._id.toString(), isAdmin: user.isAdmin },
      secret,
      { expiresIn: "3d" }
    );

    const { password: _pw, ...others } = user;
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
