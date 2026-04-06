require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const corsOrigin = process.env.CORS_ORIGIN;
const corsOptions = {
  origin: corsOrigin ? corsOrigin.split(",").map((s) => s.trim()) : true,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || "100kb" }));

function lazyRoute(loader) {
  let router;
  return (req, res, next) => {
    if (!router) router = loader();
    return router(req, res, next);
  };
}

app.use("/api/auth", lazyRoute(() => require("./routes/auth")));
app.use("/api/users", lazyRoute(() => require("./routes/user")));
app.use("/api", lazyRoute(() => require("./routes/schemes")));

const PORT = Number(process.env.PORT) || 5000;

const server = app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}!`);
});

setImmediate(() => {
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", true);

  const url = process.env.MONGO_URL;
  if (!url) {
    console.warn("MONGO_URL is not set; database features will fail until it is configured.");
    return;
  }

  mongoose
    .connect(url, {
      dbName: process.env.MONGO_DB_NAME || "DivyaSarthi",
      maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE) || 5,
      minPoolSize: Number(process.env.MONGO_MIN_POOL_SIZE) || 0,
      serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS) || 10_000,
    })
    .then(() => console.log("DB Connection Successful!"))
    .catch((err) => console.log("DB Connection Error:", err.message));
});

function shutdown(signal) {
  return () => {
    console.log(`${signal} received, closing HTTP server…`);
    server.close(() => {
      const mongoose = require("mongoose");
      if (mongoose.connection.readyState === 1) {
        mongoose.connection
          .close()
          .then(() => process.exit(0))
          .catch(() => process.exit(1));
      } else {
        process.exit(0);
      }
    });
  };
}

process.on("SIGTERM", shutdown("SIGTERM"));
process.on("SIGINT", shutdown("SIGINT"));
