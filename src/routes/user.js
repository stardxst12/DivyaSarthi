const router = require("express").Router();
const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/authMiddleware");

let bcryptModule;
function bcrypt() {
  if (!bcryptModule) bcryptModule = require("bcrypt");
  return bcryptModule;
}

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/all", verifyTokenAndAdmin, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit, 10) || 20)
    );
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find()
        .select("-password")
        .sort({ _id: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(),
    ]);

    res.status(200).json({
      data: users,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const update = { ...req.body };
    if (update.password) {
      const salt = await bcrypt().genSalt(10);
      update.password = await bcrypt().hash(update.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true }
    )
      .select("-password")
      .lean();

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id).lean();
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
