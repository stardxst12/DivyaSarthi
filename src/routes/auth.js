const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  console.log("[REGISTER] Request received:", req.body);

  try {
    const { username, email, password } = req.body;

    // Check for missing fields
    if (!username || !email || !password) {
      console.warn("[REGISTER] Missing fields in request");
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      console.warn("[REGISTER] Username or Email already in use:", username, email);
      return res.status(400).json({ message: "Username or Email already in use!" });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    console.log("[REGISTER] User created successfully:", username);
    res.status(201).json({ message: "User registered successfully!" });

  } catch (err) {
    console.error("[REGISTER] Error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  console.log("[LOGIN] Request received:", req.body);

  try {
    const { username, password } = req.body;
    if (!username || !password) {
      console.warn("[LOGIN] Missing credentials");
      return res.status(400).json({ message: "Username and password are required!" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      console.warn("[LOGIN] Invalid username:", username);
      return res.status(401).json({ message: "Invalid Username or Password!" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.warn("[LOGIN] Incorrect password for user:", username);
      return res.status(401).json({ message: "Invalid Username or Password!" });
    }

    // Generate JWT Token
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password: _, ...others } = user._doc;
    console.log("[LOGIN] User logged in successfully:", username);
    res.status(200).json({ ...others, accessToken });

  } catch (err) {
    console.error("[LOGIN] Error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

module.exports = router;
