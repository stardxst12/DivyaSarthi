const jwt = require("jsonwebtoken");

const NO_TOKEN = "NO_TOKEN";

function verifyJwtAsync(token, secret) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
}

async function readBearerUser(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const e = new Error("Access Denied! No token provided.");
    e.code = NO_TOKEN;
    throw e;
  }
  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SEC;
  if (!secret) {
    const e = new Error("Server misconfiguration");
    e.code = "CONFIG";
    throw e;
  }
  return verifyJwtAsync(token, secret);
}

const verifyToken = async (req, res, next) => {
  try {
    req.user = await readBearerUser(req);
    next();
  } catch (err) {
    if (err.code === NO_TOKEN) {
      return res.status(401).json({ message: err.message });
    }
    if (err.code === "CONFIG") {
      return res.status(500).json({ message: "Server misconfiguration" });
    }
    return res.status(403).json({ message: "Invalid or Expired Token" });
  }
};

const verifyTokenAndAuthorization = async (req, res, next) => {
  try {
    req.user = await readBearerUser(req);
    const uid = String(req.user.id);
    const paramId = String(req.params.id);
    if (uid === paramId || req.user.isAdmin) {
      return next();
    }
    return res
      .status(403)
      .json({ message: "You are not allowed to perform this action!" });
  } catch (err) {
    if (err.code === NO_TOKEN) {
      return res.status(401).json({ message: err.message });
    }
    if (err.code === "CONFIG") {
      return res.status(500).json({ message: "Server misconfiguration" });
    }
    return res.status(403).json({ message: "Invalid or Expired Token" });
  }
};

const verifyTokenAndAdmin = async (req, res, next) => {
  try {
    req.user = await readBearerUser(req);
    if (req.user.isAdmin) {
      return next();
    }
    return res
      .status(403)
      .json({ message: "Only admins can perform this action!" });
  } catch (err) {
    if (err.code === NO_TOKEN) {
      return res.status(401).json({ message: err.message });
    }
    if (err.code === "CONFIG") {
      return res.status(500).json({ message: "Server misconfiguration" });
    }
    return res.status(403).json({ message: "Invalid or Expired Token" });
  }
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
