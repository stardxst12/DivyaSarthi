const router = require("express").Router();
const User = require("../models/User");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../middleware/authMiddleware");

// ✅ Get logged-in user profile (Requires Authentication)
router.get("/profile", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // Exclude password
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
});

// ✅ Get all users (Admin only)
router.get("/all", verifyTokenAndAdmin, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
});

// ✅ Get user by ID (Admin only)
router.get("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
});

// ✅ Update user (Only the user themselves or admin)
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).select("-password");
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
});

// ✅ Delete user (Only the user themselves or admin)
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
});

module.exports = router;
