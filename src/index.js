require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const schemeRoutes = require('./routes/schemes');


const app = express();

// Enable CORS for frontend access
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, dbName:"DivyaSarthi" })
  .then(() => console.log("DB Connection Successful!"))
  .catch((err) => console.log("DB Connection Error:", err));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use('/api', schemeRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}!`);
});
